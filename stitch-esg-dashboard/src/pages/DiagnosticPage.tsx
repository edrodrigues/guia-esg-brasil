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
import { ProgressCircle, CategoryBar } from '@tremor/react';

export const DiagnosticPage: React.FC = () => {
  const { user, refreshAuth } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);

  const totalQuestions = diagnosticQuestions.length;
  const currentQuestion = diagnosticQuestions[currentStep];
  const progress = Math.round(((Object.keys(answers).length) / totalQuestions) * 100);

  const currentCategory = currentQuestion?.category || 'form';

  useEffect(() => {
    const loadDiagnostic = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;
        
        const companyId = userDoc.data().companyId;

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

  const handleOptionSelect = (value: number | string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleTextChange = (value: string) => {
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
      await updateDoc(doc(db, 'diagnostics', diagnosticId), {
        completed: true,
        formData: answers,
        completedAt: Timestamp.now()
      });

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const companyId = userDoc.data()?.companyId;
      const companyRef = doc(db, 'companies', companyId);

      const companyData: Record<string, unknown> = {
        formData: answers,
        lastDiagnosticDate: Timestamp.now()
      };

      if (answers['form_1.1']) {
        companyData.name = answers['form_1.1'];
      }

      await updateDoc(companyRef, companyData);

      if (refreshAuth) await refreshAuth();

      navigate('/environmental');
    } catch (err) {
      console.error("Error finishing diagnostic:", err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToCategory = (cat: 'form' | 'environmental' | 'social' | 'governance') => {
    const firstOfCat = diagnosticQuestions.findIndex(q => q.category === cat);
    if (firstOfCat !== -1) {
      setCurrentStep(firstOfCat);
    }
  };

  const previewScores = useMemo(() => {
    return {
      env: 0,
      soc: 0,
      gov: 0,
      avg: 0
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
        <div className="mb-8">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">
            Cadastro da Empresa
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            Preencha os dados da sua empresa para continuar com o diagnóstico ESG.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-emerald-900/5">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">PROGRESSO DA MISSÃO</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{progress}% Concluído</h3>
              </div>
              <span className="text-xs font-black text-primary uppercase tracking-widest">{Object.keys(answers).length} / {totalQuestions} Dados</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Nível atual da missão: <span className="text-primary italic">Iniciante ESG</span>
            </p>
          </div>

          <div className="bg-primary text-slate-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between border-b-8 border-emerald-600 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Rocket size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2 flex items-center gap-2 uppercase tracking-tighter">
                <Rocket size={20} /> Próximo Passo!
              </h4>
              <p className="text-slate-900/80 text-xs font-bold uppercase tracking-wide leading-relaxed">
                Continue na seção {currentCategory === 'environmental' ? 'Ambiental' : currentCategory === 'social' ? 'Social' : 'Governança'} e conquiste mais XP.
              </p>
            </div>
            <Button 
              className="mt-6 bg-white text-primary font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all uppercase text-[10px] tracking-[0.2em] shadow-lg relative z-10"
              onClick={() => {}}
            >
              Retomar Missão
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap border-b-2 border-slate-100 dark:border-slate-800 gap-2 md:gap-8 mb-8">
          <button 
            onClick={() => navigateToCategory('form')}
            className={`pb-4 px-2 border-b-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all
              ${currentCategory === 'form' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}
            `}
          >
            <span className="material-symbols-outlined text-lg">description</span> Dados da Empresa
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <Card className="border-b-8">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black mb-4 uppercase tracking-widest border border-primary/20">
                  Dados da Empresa - Passo {currentStep + 1} de {totalQuestions}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight uppercase tracking-tight">
                  {currentQuestion.text}
                </h3>
                {currentQuestion.description && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest opacity-70">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {(!currentQuestion.inputType || currentQuestion.inputType === 'radio') && currentQuestion.options?.map((option, idx) => (
                  <label 
                    key={idx}
                    className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group
                      ${answers[currentQuestion.id] === option.value
                        ? 'border-primary bg-primary/5 shadow-lg scale-[1.01]'
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
                    <span className={`ml-4 font-black text-[10px] uppercase tracking-widest transition-colors
                      ${answers[currentQuestion.id] === option.value ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}
                    `}>
                      {option.label}
                    </span>
                  </label>
                ))}

                {currentQuestion.inputType === 'text' && (
                  <input
                    type="text"
                    value={(answers[currentQuestion.id] as string) || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Digite sua resposta..."
                  />
                )}

                {currentQuestion.inputType === 'select' && currentQuestion.options && (
                  <select
                    value={(answers[currentQuestion.id] as string) || ''}
                    onChange={(e) => handleOptionSelect(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="">Selecione uma opção</option>
                    {currentQuestion.options.map((option, idx) => (
                      <option key={idx} value={option.value as string}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mt-10 pt-8 border-t-2 border-slate-100 dark:border-slate-800 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="px-8 py-4 border-2 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]"
                >
                  <ChevronLeft size={18} className="mr-2" /> Voltar
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={answers[currentQuestion.id] === undefined || saving}
                  isLoading={saving}
                  className="px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/20"
                >
                  {currentStep === totalQuestions - 1 ? 'Finalizar e Continuar' : 'Próximo'}
                  {currentStep !== totalQuestions - 1 && <ChevronRight size={18} className="ml-2" />}
                </Button>
              </div>
            </Card>

            <div className="bg-primary/5 border-2 border-dashed border-primary/20 p-8 rounded-3xl">
              <div className="flex gap-6">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                  <Lightbulb size={28} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white mb-1 uppercase tracking-widest text-xs">Dica de Mestre</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Empresas que monitoram indicadores ESG têm 40% mais chances de atrair investimentos sustentáveis no mercado brasileiro!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <Card className="p-8 border-b-8">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <Sparkles size={20} className="text-primary" /> Sua Jornada
              </h3>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase mb-4 tracking-[0.2em]">PONTOS FORTES</p>
                  <div className="space-y-4">
                    {previewScores.avg > 40 ? (
                      <div className="flex items-start gap-4">
                        <div className="mt-1 size-6 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                          <Check size={14} strokeWidth={4} />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Progresso Iniciado</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-70">Sua empresa já deu os primeiros passos.</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Responda mais para ver os pontos fortes...</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-amber-500 uppercase mb-4 tracking-[0.2em]">DESAFIOS</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 size-6 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200">
                        <AlertCircle size={14} strokeWidth={4} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Gap de Dados</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-70">Algumas áreas ainda precisam de monitoramento.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">PRÓXIMAS AÇÕES</p>
                  <ul className="text-[10px] space-y-3 font-black text-slate-500 uppercase tracking-widest">
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Digitalizar monitoramento</li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Treinar a liderança</li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Definir metas para 2030</li>
                  </ul>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-8 py-4 border-2 border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-50 rounded-2xl"
              >
                Ver Mapa Detalhado
              </Button>
            </Card>

            <Card className="p-8 flex flex-col items-center justify-center border-b-8">
              <p className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-[0.2em]">PERFIL DE MATURIDADE ATUAL</p>
              
              <ProgressCircle
                value={previewScores.avg}
                size="xl"
                color="emerald"
                showAnimation={true}
                className="scale-150 my-8"
              >
                <div className="text-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-white drop-shadow-sm font-mono">
                    {getLetterScore(previewScores.avg)}
                  </span>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">Grade</p>
                </div>
              </ProgressCircle>

              <div className="w-full space-y-6 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-teal-500">Ambiental (E)</span>
                    <span>{previewScores.env}%</span>
                  </div>
                  <CategoryBar 
                    values={[previewScores.env, 100 - previewScores.env]} 
                    colors={['emerald', 'slate']} 
                    showLabels={false}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-orange-500">Social (S)</span>
                    <span>{previewScores.soc}%</span>
                  </div>
                  <CategoryBar 
                    values={[previewScores.soc, 100 - previewScores.soc]} 
                    colors={['orange', 'slate']} 
                    showLabels={false}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-indigo-500">Governança (G)</span>
                    <span>{previewScores.gov}%</span>
                  </div>
                  <CategoryBar 
                    values={[previewScores.gov, 100 - previewScores.gov]} 
                    colors={['indigo', 'slate']} 
                    showLabels={false}
                    className="h-2"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
