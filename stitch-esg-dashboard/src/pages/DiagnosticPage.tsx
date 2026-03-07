import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { diagnosticQuestions } from '../data/questions';
import { useAuth } from '../context/useAuth';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Check, Lightbulb, Rocket, ChevronRight, ChevronLeft } from 'lucide-react';
import { calculateESGScore, calculateESGDelta, calculateGoalsFromScores } from '../utils/scoreCalculator';

export const DiagnosticPage: React.FC = () => {
  const { user, refreshAuth } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  const isQuestionVisible = useCallback((question: typeof diagnosticQuestions[0]) => {
    if (!question.dependsOn) return true;
    return answers[question.dependsOn.questionId] === question.dependsOn.value;
  }, [answers]);

  const visibleQuestions = useMemo(() => {
    return diagnosticQuestions.filter(q => isQuestionVisible(q));
  }, [isQuestionVisible]);

  const currentVisibleQuestion = visibleQuestions[currentStep];
  const currentCategory = currentVisibleQuestion?.category || 'form';
  
  const answeredVisible = useMemo(
    () => visibleQuestions.filter(q => answers[q.id] !== undefined).length,
    [visibleQuestions, answers]
  );
  const progress = Math.round((answeredVisible / visibleQuestions.length) * 100);

  const saveProgress = useCallback(async (answersToSave: Record<string, number | string>, force = false) => {
    const answersKey = JSON.stringify(answersToSave);
    
    if (!force && answersKey === lastSavedRef.current) return;
    if (!user || !companyId || !diagnosticId) return;
    
    lastSavedRef.current = answersKey;

    try {
      await updateDoc(doc(db, 'diagnostics', diagnosticId), {
        companyId,
        responses: answersToSave,
        completed: false,
        lastUpdated: Timestamp.now()
      });
    } catch (err) {
      console.error("Error saving progress:", err);
      lastSavedRef.current = '';
    }
  }, [user, companyId, diagnosticId]);

  const debouncedSave = useCallback((answersToSave: Record<string, number | string>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(answersToSave);
    }, 1500);
  }, [saveProgress]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadDiagnostic = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;
        
        const cid = userDoc.data().companyId;
        setCompanyId(cid);

        const q = query(
          collection(db, 'diagnostics'), 
          where('companyId', '==', cid),
          where('completed', '==', false)
        );
        
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const diagData = querySnapshot.docs[0].data();
          setDiagnosticId(querySnapshot.docs[0].id);
          setAnswers(diagData.responses || {});
          lastSavedRef.current = JSON.stringify(diagData.responses || {});
          
          const savedAnswers = diagData.responses || {};
          const answeredVisibleCount = visibleQuestions.filter(q => savedAnswers[q.id] !== undefined).length;
          if (answeredVisibleCount < visibleQuestions.length) {
            setCurrentStep(answeredVisibleCount);
          } else {
            setCurrentStep(visibleQuestions.length - 1);
          }
        }
      } catch (err) {
        console.error("Error loading diagnostic:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDiagnostic();
  }, [user, visibleQuestions]);

  const handleOptionSelect = (value: number | string) => {
    const newAnswers = { ...answers, [currentVisibleQuestion.id]: value };
    setAnswers(newAnswers);
    debouncedSave(newAnswers);
  };

  const handleTextChange = (value: string) => {
    const newAnswers = { ...answers, [currentVisibleQuestion.id]: value };
    setAnswers(newAnswers);
    debouncedSave(newAnswers);
  };

  const handleNext = useCallback(async () => {
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishDiagnostic();
    }
  }, [currentStep, visibleQuestions.length, finishDiagnostic]);

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Prevent default to avoid form submission if any
      if (answers[currentVisibleQuestion?.id] !== undefined) {
        handleNext();
      }
    }
  }, [answers, currentVisibleQuestion, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const finishDiagnostic = useCallback(async () => {
    if (!user || !diagnosticId || !companyId) return;
    
    await saveProgress(answers, true);
    setIsFinishing(true);

    try {
      await updateDoc(doc(db, 'diagnostics', diagnosticId), {
        completed: true,
        formData: answers,
        completedAt: Timestamp.now()
      });

      const companyRef = doc(db, 'companies', companyId);
      const companyDoc = await getDoc(companyRef);
      const companyOldData = companyDoc.exists() ? companyDoc.data() : {};
      
      const currentXP = companyOldData.currentXP || 0;
      const previousScores = companyOldData.esgScores || { environmental: 0, social: 0, governance: 0 };
      
      const newScores = calculateESGScore(answers);
      const newDelta = calculateESGDelta(newScores, previousScores);
      const newGoals = calculateGoalsFromScores(newScores.environmental, newScores.social, newScores.governance);
      
      // Update evolution data with current month's total average score
      const esgAvg = Math.round((newScores.environmental + newScores.social + newScores.governance) / 3);
      const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
      const currentMonth = months[new Date().getMonth()];
      
      const evolutionData = companyOldData.evolutionData || [];
      const monthIndex = evolutionData.findIndex((d: { month: string }) => d.month === currentMonth);
      if (monthIndex >= 0) {
        evolutionData[monthIndex].score = esgAvg;
      } else {
        evolutionData.push({ month: currentMonth, score: esgAvg });
      }

      const companyData: Record<string, unknown> = {
        formData: answers,
        lastDiagnosticDate: Timestamp.now(),
        currentXP: currentXP + 500,
        esgScores: newScores,
        esgDelta: newDelta,
        goals: newGoals,
        evolutionData: evolutionData
      };

      if (answers['form_1.1']) {
        companyData.name = answers['form_1.1'];
      }

      await updateDoc(companyRef, companyData);

      if (refreshAuth) await refreshAuth();

      setShowSuccess(true);
      
      // Brief delay to show success state
      setTimeout(() => {
        navigate('/environmental');
      }, 2000);
    } catch (err) {
      console.error("Error finishing diagnostic:", err);
      setIsFinishing(false);
    }
  }, [user, diagnosticId, companyId, answers, saveProgress, refreshAuth, navigate]);;

  const navigateToCategory = (cat: 'form' | 'environmental' | 'social' | 'governance') => {
    const visibleIndex = visibleQuestions.findIndex(q => q.category === cat);
    if (visibleIndex !== -1) {
      setCurrentStep(visibleIndex);
    }
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
            Questionário Inicial
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            Preencha os dados da sua empresa para continuar com o questionário ESG.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-emerald-900/5">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">PROGRESSO DA MISSÃO</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{progress}% Concluído</h3>
              </div>
              <span className="text-xs font-black text-primary uppercase tracking-widest">{answeredVisible} / {visibleQuestions.length} Dados</span>
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
                {currentCategory === 'form' 
                  ? "Conclua a sessão de Cadastro para ganhar 500 de XP e avançar para a aba Ambiental."
                  : `Continue na seção ${currentCategory === 'environmental' ? 'Ambiental' : currentCategory === 'social' ? 'Social' : 'Governança'} e conquiste mais XP.`
                }
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
          <div className="lg:col-span-12 space-y-8 max-w-4xl mx-auto w-full">
            <Card className="border-b-8">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black mb-4 uppercase tracking-widest border border-primary/20">
                  Dados da Empresa - Passo {currentStep + 1} de {visibleQuestions.length}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight uppercase tracking-tight">
                  {currentVisibleQuestion.text}
                </h3>
                {currentVisibleQuestion.description && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest opacity-70">
                    {currentVisibleQuestion.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {(!currentVisibleQuestion.inputType || currentVisibleQuestion.inputType === 'radio') && currentVisibleQuestion.options?.map((option, idx) => (
                  <label 
                    key={idx}
                    className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group
                      ${answers[currentVisibleQuestion.id] === option.value
                        ? 'border-primary bg-primary/5 shadow-lg scale-[1.01]'
                        : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${answers[currentVisibleQuestion.id] === option.value 
                        ? 'border-primary bg-primary' 
                        : 'border-slate-300 dark:border-slate-600 group-hover:border-primary'}
                    `}>
                      {answers[currentVisibleQuestion.id] === option.value && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                    <input 
                      type="radio" 
                      name={currentVisibleQuestion.id} 
                      className="hidden"
                      checked={answers[currentVisibleQuestion.id] === option.value}
                      onChange={() => handleOptionSelect(option.value)}
                    />
                    <span className={`ml-4 font-black text-[10px] uppercase tracking-widest transition-colors
                      ${answers[currentVisibleQuestion.id] === option.value ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}
                    `}>
                      {option.label}
                    </span>
                  </label>
                ))}

                {currentVisibleQuestion.inputType === 'text' && (
                  <input
                    type="text"
                    value={(answers[currentVisibleQuestion.id] as string) || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Digite sua resposta..."
                    autoFocus
                  />
                )}

                {currentVisibleQuestion.inputType === 'select' && currentVisibleQuestion.options && (
                  <select
                    value={(answers[currentVisibleQuestion.id] as string) || ''}
                    onChange={(e) => handleOptionSelect(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="">Selecione uma opção</option>
                    {currentVisibleQuestion.options.map((option, idx) => (
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
                  disabled={answers[currentVisibleQuestion.id] === undefined || isFinishing}
                  isLoading={isFinishing && !showSuccess}
                  className={`px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all duration-300
                    ${showSuccess 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/40' 
                      : 'shadow-emerald-500/20'}
                  `}
                >
                  {showSuccess ? (
                    <span className="flex items-center gap-2">
                      <Check size={18} strokeWidth={4} /> Pronto!
                    </span>
                  ) : currentStep === visibleQuestions.length - 1 ? (
                    'Finalizar e Continuar'
                  ) : (
                    'Próximo'
                  )}
                  {!showSuccess && currentStep !== visibleQuestions.length - 1 && <ChevronRight size={18} className="ml-2" />}
                </Button>
              </div>
            </Card>

            {showSuccess && (
              <div className="fixed inset-0 flex items-center justify-center z-[100] animate-in fade-in zoom-in duration-300 bg-slate-900/20 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border-2 border-primary/20 flex flex-col items-center text-center max-w-sm mx-4">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Check size={40} strokeWidth={4} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Salvo com Sucesso!</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                    Seu questionário foi registrado. Desbloqueando trilha Ambiental...
                  </p>
                </div>
              </div>
            )}

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
        </div>
      </div>
    </DashboardLayout>
  );
};
