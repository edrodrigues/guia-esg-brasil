import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { diagnosticQuestions } from '../data/questions';
import { useAuth } from '../context/useAuth';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Check, Lightbulb, Rocket, ChevronRight, ChevronLeft, Sparkles, AlertCircle } from 'lucide-react';

export const DiagnosticPage: React.FC = () => {
  const { user, refreshAuth } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);

  const totalQuestions = diagnosticQuestions.length;
  const currentQuestion = diagnosticQuestions[currentStep];
  const progress = Math.round(((Object.keys(answers).length) / totalQuestions) * 100);

  const currentCategory = currentQuestion?.category || 'environmental';

  // Load existing diagnostic or create new session state
  useEffect(() => {
    const loadDiagnostic = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;
        
        const companyId = userDoc.data().companyId;

        // Check for in-progress diagnostic
        const q = query(
          collection(db, 'diagnostics'), 
          where('companyId', '==', companyId),
          where('completed', '==', false)
        );
        
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const diagData = querySnapshot.docs[0].data();
          setDiagnosticId(querySnapshot.docs[0].id);
          setAnswers(diagData.responses || {});
          
          // Resume from last answered question
          const answeredCount = Object.keys(diagData.responses || {}).length;
          if (answeredCount < totalQuestions) {
            setCurrentStep(answeredCount);
          } else {
            setCurrentStep(totalQuestions - 1);
          }
        }
      } catch (err) {
        console.error("Error loading diagnostic:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDiagnostic();
  }, [user, totalQuestions]);

  const handleOptionSelect = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const saveProgress = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const companyId = userDoc.data()?.companyId;
      
      const diagData = {
        companyId,
        responses: answers,
        completed: false,
        lastUpdated: Timestamp.now()
      };

      if (diagnosticId) {
        await updateDoc(doc(db, 'diagnostics', diagnosticId), diagData);
      } else {
        const newDiagRef = doc(collection(db, 'diagnostics'));
        await setDoc(newDiagRef, diagData);
        setDiagnosticId(newDiagRef.id);
      }
    } catch (err) {
      console.error("Error saving progress:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveProgress();
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishDiagnostic();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finishDiagnostic = async () => {
    if (!user || !diagnosticId) return;
    setLoading(true);

    try {
      // 1. Calculate Scores
      let envScore = 0, socScore = 0, govScore = 0;
      let envCount = 0, socCount = 0, govCount = 0;

      diagnosticQuestions.forEach(q => {
        const val = answers[q.id] || 0;
        if (q.category === 'environmental') { envScore += val; envCount++; }
        if (q.category === 'social') { socScore += val; socCount++; }
        if (q.category === 'governance') { govScore += val; govCount++; }
      });

      const finalScores = {
        environmental: envCount ? Math.round(envScore / envCount) : 0,
        social: socCount ? Math.round(socScore / socCount) : 0,
        governance: govCount ? Math.round(govScore / govCount) : 0,
      };

      // 2. Update Diagnostic Doc
      await updateDoc(doc(db, 'diagnostics', diagnosticId), {
        completed: true,
        finalScores,
        completedAt: Timestamp.now()
      });

      // 3. Update Company Doc (XP + Scores)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const companyId = userDoc.data()?.companyId;
      const companyRef = doc(db, 'companies', companyId);
      const companySnap = await getDoc(companyRef);
      
      const currentXP = companySnap.data()?.currentXP || 0;
      const newXP = currentXP + 500; // Reward for completion
      const newLevel = Math.floor(newXP / 1000) + 1;

      await updateDoc(companyRef, {
        esgScores: finalScores,
        currentXP: newXP,
        level: newLevel,
        lastDiagnosticDate: Timestamp.now()
      });

      if (refreshAuth) await refreshAuth();

      navigate('/dashboard');
    } catch (err) {
      console.error("Error finishing diagnostic:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper for tab navigation
  const navigateToCategory = (cat: 'environmental' | 'social' | 'governance') => {
    const firstOfCat = diagnosticQuestions.findIndex(q => q.category === cat);
    if (firstOfCat !== -1) {
      setCurrentStep(firstOfCat);
    }
  };

  // Calculate scores for preview
  const previewScores = useMemo(() => {
    let env = 0, soc = 0, gov = 0;
    let ec = 0, sc = 0, gc = 0;
    
    Object.entries(answers).forEach(([qId, val]) => {
      const q = diagnosticQuestions.find(dq => dq.id === qId);
      if (q?.category === 'environmental') { env += val; ec++; }
      if (q?.category === 'social') { soc += val; sc++; }
      if (q?.category === 'governance') { gov += val; gc++; }
    });

    return {
      env: ec ? Math.round(env / ec) : 0,
      soc: sc ? Math.round(soc / sc) : 0,
      gov: gc ? Math.round(gov / gc) : 0,
      avg: (ec + sc + gc) ? Math.round((env + soc + gov) / (ec + sc + gc)) : 0
    };
  }, [answers]);

  const getLetterScore = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    return 'D';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary dark:from-white dark:to-primary">
            Jornada de Maturidade ESG
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Explore o desempenho de sustentabilidade da sua empresa pelos pilares Ambiental, Social e Governança de um jeito divertido!
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-100 dark:border-slate-800 shadow-sm border-b-8 border-r-8 border-primary/10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">PROGRESSO DA MISSÃO</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{progress}% Concluído</h3>
              </div>
              <span className="text-sm font-bold text-slate-500">{Object.keys(answers).length} de {totalQuestions} desafios</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-teal-400 to-primary h-full rounded-full shadow-[0_0_10px_rgba(32,178,170,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Nível atual da missão: Iniciante ESG
            </p>
          </div>

          <div className="bg-primary text-slate-900 p-6 rounded-xl shadow-lg flex flex-col justify-between border-b-8 border-r-8 border-teal-700 chunky-shadow">
            <div>
              <h4 className="text-lg font-black mb-1 flex items-center gap-2">
                <Rocket size={20} /> Próximo Passo!
              </h4>
              <p className="text-slate-900/80 text-sm font-bold">
                Continue de onde parou na seção {currentCategory === 'environmental' ? 'Ambiental' : currentCategory === 'social' ? 'Social' : 'Governança'} e conquiste mais XP.
              </p>
            </div>
            <Button 
              className="mt-4 bg-white text-primary font-black py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 border-b-4 border-slate-200"
              onClick={() => {}}
            >
              Retomar Missão <span className="material-symbols-outlined">rocket_launch</span>
            </Button>
          </div>
        </div>

        {/* Pillar Navigation */}
        <div className="flex flex-wrap border-b-2 border-slate-100 dark:border-slate-800 gap-2 md:gap-8 mb-8">
          <button 
            onClick={() => navigateToCategory('environmental')}
            className={`pb-4 px-2 border-b-4 font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all
              ${currentCategory === 'environmental' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}
            `}
          >
            <span className="material-symbols-outlined text-lg">forest</span> Ambiental (E)
          </button>
          <button 
            onClick={() => navigateToCategory('social')}
            className={`pb-4 px-2 border-b-4 font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all
              ${currentCategory === 'social' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}
            `}
          >
            <span className="material-symbols-outlined text-lg">diversity_3</span> Social (S)
          </button>
          <button 
            onClick={() => navigateToCategory('governance')}
            className={`pb-4 px-2 border-b-4 font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all
              ${currentCategory === 'governance' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}
            `}
          >
            <span className="material-symbols-outlined text-lg">account_balance</span> Governança (G)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Questionnaire Section */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="border-b-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black mb-4 uppercase tracking-widest">
                  {currentCategory === 'environmental' ? 'Nível 1: Eco-Guerreiro' : currentCategory === 'social' ? 'Nível 1: Guardião Social' : 'Nível 1: Mestre da Ética'}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                  {currentQuestion.text}
                </h3>
                {currentQuestion.description && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <label 
                    key={idx}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group
                      ${answers[currentQuestion.id] === option.value
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                        : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${answers[currentQuestion.id] === option.value 
                        ? 'border-primary bg-primary' 
                        : 'border-slate-300 dark:border-slate-600 group-hover:border-primary'}
                    `}>
                      {answers[currentQuestion.id] === option.value && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                    <input 
                      type="radio" 
                      name={currentQuestion.id} 
                      className="hidden"
                      checked={answers[currentQuestion.id] === option.value}
                      onChange={() => handleOptionSelect(option.value)}
                    />
                    <span className={`ml-4 font-black text-sm uppercase tracking-wide transition-colors
                      ${answers[currentQuestion.id] === option.value ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}
                    `}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-slate-100 dark:border-slate-800 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="px-6 border-b-4"
                >
                  <ChevronLeft size={20} className="mr-1" /> Voltar
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={answers[currentQuestion.id] === undefined || saving}
                  isLoading={saving}
                  className="px-8 border-b-4 border-r-4 border-teal-700 chunky-shadow"
                >
                  {currentStep === totalQuestions - 1 ? 'Finalizar Missão' : 'Próximo Desafio'}
                  {currentStep !== totalQuestions - 1 && <ChevronRight size={20} className="ml-1" />}
                </Button>
              </div>
            </Card>

            <div className="bg-primary/5 border-2 border-dashed border-primary/30 p-6 rounded-xl animate-pulse" style={{ animationDuration: '4s' }}>
              <div className="flex gap-4">
                <div className="bg-primary p-2 rounded-lg text-white">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">Dica de Mestre</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    Empresas que monitoram indicadores ESG têm 40% mais chances de atrair investimentos sustentáveis no mercado brasileiro!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Preview Section */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 border-b-8">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <Sparkles size={20} className="text-primary" /> Sua Jornada
              </h3>
              
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <p className="text-[10px] font-black text-primary uppercase mb-3 tracking-[0.2em]">PONTOS FORTES</p>
                  <div className="space-y-3">
                    {previewScores.avg > 40 ? (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 size-5 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                          <Check size={12} strokeWidth={4} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Progresso Iniciado</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sua empresa já deu os primeiros passos.</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-bold italic">Continue respondendo para ver seus pontos fortes...</p>
                    )}
                  </div>
                </div>

                {/* Challenges */}
                <div>
                  <p className="text-[10px] font-black text-amber-500 uppercase mb-3 tracking-[0.2em]">DESAFIOS PARA VENCER</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 size-5 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                        <AlertCircle size={12} strokeWidth={4} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Gap de Dados</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Algumas áreas ainda precisam de monitoramento.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">RECOMENDAÇÕES</p>
                  <ul className="text-xs space-y-2 font-bold text-slate-500 uppercase tracking-widest">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> Digitalizar monitoramento</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> Treinar a liderança</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> Definir metas para 2030</li>
                  </ul>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-6 py-3 border-2 border-slate-200 text-slate-600 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 border-b-4"
              >
                Ver Mapa Detalhado
              </Button>
            </Card>

            {/* Visual Chart Placeholder */}
            <Card className="p-6 flex flex-col items-center justify-center border-b-8">
              <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">PERFIL DE MATURIDADE ATUAL</p>
              
              <div className="relative size-48 flex items-center justify-center rounded-full border-[10px] border-slate-100 dark:border-slate-800 shadow-inner">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" fill="transparent" r="45" 
                    stroke="currentColor" 
                    className="text-primary/10"
                    strokeWidth="10"
                  />
                  <circle 
                    cx="50" cy="50" fill="transparent" r="45" 
                    stroke="currentColor" 
                    strokeDasharray="282.7" 
                    strokeDashoffset={282.7 - (282.7 * previewScores.avg / 100)} 
                    strokeLinecap="round" 
                    strokeWidth="10"
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="text-center z-10">
                  <span className="text-5xl font-black text-slate-900 dark:text-white drop-shadow-sm">
                    {getLetterScore(previewScores.avg)}
                  </span>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">PONTUAÇÃO</p>
                </div>
              </div>

              <div className="flex gap-6 mt-8">
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ENV</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{previewScores.env}%</div>
                  <div className="w-8 h-1 bg-teal-500/20 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: `${previewScores.env}%` }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SOC</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{previewScores.soc}%</div>
                  <div className="w-8 h-1 bg-orange-500/20 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${previewScores.soc}%` }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GOV</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{previewScores.gov}%</div>
                  <div className="w-8 h-1 bg-indigo-500/20 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${previewScores.gov}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
