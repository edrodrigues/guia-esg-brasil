import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Question } from '../types';
import { useAuth } from '../context/useAuth';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Check, Lightbulb, Rocket, ChevronRight, ChevronLeft } from 'lucide-react';
import { calculateESGScore, calculateESGDelta, calculateGoalsFromScores } from '../utils/scoreCalculator';

export const DiagnosticPage: React.FC = () => {
  const { user, refreshAuth } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');
  const questionnaireRef = useRef<HTMLDivElement>(null);

  const isQuestionVisible = useCallback((question: Question) => {
    if (!question.dependsOn) return true;
    return answers[question.dependsOn.questionId] === question.dependsOn.value;
  }, [answers]);

  const visibleQuestions = useMemo(() => {
    return questions.filter(q => isQuestionVisible(q));
  }, [questions, isQuestionVisible]);

  const currentVisibleQuestion = visibleQuestions[currentStep];
  const currentCategory = currentVisibleQuestion?.category || 'form';

  const answeredVisible = useMemo(
    () => visibleQuestions.filter(q => answers[q.id] !== undefined).length,
    [visibleQuestions, answers]
  );
  const progress = visibleQuestions.length > 0 
    ? Math.round((answeredVisible / visibleQuestions.length) * 100)
    : 0;

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
    const loadQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const q = query(collection(db, 'questions'));
        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map(doc => ({
          ...doc.data()
        } as Question));
        
        // Custom sort to maintain category order: form -> environmental -> social -> governance
        const categoryOrder = { 'form': 0, 'environmental': 1, 'social': 2, 'governance': 3 };
        fetchedQuestions.sort((a, b) => {
          if (categoryOrder[a.category as keyof typeof categoryOrder] !== categoryOrder[b.category as keyof typeof categoryOrder]) {
            return categoryOrder[a.category as keyof typeof categoryOrder] - categoryOrder[b.category as keyof typeof categoryOrder];
          }
          return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
        });
        
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("Error loading questions from Firestore:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    const loadDiagnostic = async () => {
      if (!user || loadingQuestions) {
        console.log("DiagnosticPage: No user or still loading questions");
        return;
      }

      setLoading(true);
      console.log("DiagnosticPage: Loading diagnostic for user", user.uid);

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          console.error("DiagnosticPage: User document not found in Firestore for UID:", user.uid);
          alert("Erro: Perfil de usuário não encontrado. Por favor, tente sair e entrar novamente.");
          return;
        }

        const cid = userDoc.data().companyId;
        setCompanyId(cid);
        console.log("DiagnosticPage: Found companyId:", cid);

        const q = query(
          collection(db, 'diagnostics'),
          where('companyId', '==', cid)
        );

        const querySnapshot = await getDocs(q);
        const incompleteDoc = querySnapshot.docs.find(doc => doc.data().completed === false);

        if (incompleteDoc) {
          const diagData = incompleteDoc.data();
          setDiagnosticId(incompleteDoc.id);
          setAnswers(diagData.responses || {});
          lastSavedRef.current = JSON.stringify(diagData.responses || {});
          console.log("DiagnosticPage: Found existing diagnostic:", incompleteDoc.id);

          const savedAnswers = diagData.responses || {};
          // Use visibleQuestions from the already loaded questions
          const visibleForSaved = questions.filter(q => {
            if (!q.dependsOn) return true;
            return savedAnswers[q.dependsOn.questionId] === q.dependsOn.value;
          });
          
          const answeredVisibleCount = visibleForSaved.filter(q => savedAnswers[q.id] !== undefined).length;
          if (answeredVisibleCount < visibleForSaved.length) {
            setCurrentStep(answeredVisibleCount);
          } else {
            setCurrentStep(Math.max(0, visibleForSaved.length - 1));
          }
        } else {
          // Create new diagnostic if none exists
          console.log("DiagnosticPage: No existing diagnostic found, creating new one...");
          const newDiagRef = doc(collection(db, 'diagnostics'));

          setDiagnosticId(newDiagRef.id);
          setAnswers({});
          setCurrentStep(0);
          console.log("DiagnosticPage: Created local diagnostic ref:", newDiagRef.id);

          await setDoc(newDiagRef, {
            companyId: cid,
            responses: {},
            completed: false,
            createdAt: Timestamp.now(),
            lastUpdated: Timestamp.now()
          });

          console.log("DiagnosticPage: Successfully saved new diagnostic online:", newDiagRef.id);
        }
      } catch (err: any) {
        console.error("Error loading diagnostic:", err);
        if (err.code === 'unavailable' || err.message?.includes('offline')) {
          console.warn("DiagnosticPage: Firestore is offline, using cached data if available.");
        } else {
          alert("Houve um erro ao conectar com o banco de dados. Verifique sua conexão.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!loadingQuestions) {
        loadDiagnostic();
    }
  }, [user, loadingQuestions, questions.length]);

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

  const finishDiagnostic = useCallback(async () => {
    console.log("DiagnosticPage: Attempting to finish diagnostic...", {
      hasUser: !!user,
      diagnosticId,
      companyId
    });

    if (!user || !diagnosticId || !companyId) {
      console.error("Dados faltantes para finalizar diagnóstico:", {
        userId: user?.uid,
        diagnosticId,
        companyId
      });
      alert(`Não foi possível finalizar o diagnóstico no momento. Faltam dados de conexão. Recarregue a página e tente novamente.`);
      return;
    }

    await saveProgress(answers, true);
    setIsFinishing(true);

    try {
      await updateDoc(doc(db, 'diagnostics', diagnosticId), {
        completed: true,
        responses: answers,
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

      setTimeout(() => {
        navigate('/environmental');
      }, 2000);
    } catch (err: any) {
      console.error("Error finishing diagnostic:", err);
      setIsFinishing(false);
      alert("Houve um erro ao salvar seu diagnóstico. Por favor, tente novamente.");
    }
  }, [user, diagnosticId, companyId, answers, saveProgress, refreshAuth, navigate]);

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
      if (currentVisibleQuestion && answers[currentVisibleQuestion.id] !== undefined) {
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

  const scrollToQuestionnaire = () => {
    questionnaireRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToCategory = (cat: string) => {
    const visibleIndex = visibleQuestions.findIndex(q => q.category === cat);
    if (visibleIndex !== -1) {
      setCurrentStep(visibleIndex);
    }
  };

  if (loading || loadingQuestions) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg"></div>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">
            Carregando Missão...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (visibleQuestions.length === 0) {
      return (
          <DashboardLayout>
              <div className="flex flex-col items-center justify-center h-96 text-center">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Nenhuma pergunta encontrada</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Ocorreu um erro ao carregar as perguntas do banco de dados.
                  </p>
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
                Responda o questionário dessa página para ganhar 500 XP e avançar à próxima página.
              </p>
            </div>
            <Button
              className="mt-6 bg-white text-primary font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all uppercase text-[10px] tracking-[0.2em] shadow-lg relative z-10"
              onClick={scrollToQuestionnaire}
            >
              Iniciar Missão
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
          
          {['environmental', 'social', 'governance'].map(cat => (
              <button
                key={cat}
                onClick={() => navigateToCategory(cat)}
                className={`pb-4 px-2 border-b-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all
                  ${currentCategory === cat ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}
                `}
              >
                <span className="material-symbols-outlined text-lg">
                    {cat === 'environmental' ? 'eco' : cat === 'social' ? 'groups' : 'policy'}
                </span> 
                {cat === 'environmental' ? 'Ambiental' : cat === 'social' ? 'Social' : 'Governança'}
              </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10" ref={questionnaireRef}>
          <div className="lg:col-span-12 space-y-8 max-w-4xl mx-auto w-full">
            <Card className="border-b-8">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black mb-4 uppercase tracking-widest border border-primary/20">
                  {currentCategory === 'form' ? 'Dados da Empresa' : 
                   currentCategory === 'environmental' ? 'Eixo Ambiental' :
                   currentCategory === 'social' ? 'Eixo Social' : 'Eixo Governança'} - Passo {currentStep + 1} de {visibleQuestions.length}
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
                {(!currentVisibleQuestion.inputType || currentVisibleQuestion.inputType === 'radio') && currentVisibleQuestion.options?.map((option: any, idx: number) => (
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
                    <div className="ml-4 flex flex-col">
                        <span className={`font-black text-[10px] uppercase tracking-widest transition-colors
                          ${answers[currentVisibleQuestion.id] === option.value ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}
                        `}>
                          {option.label}
                        </span>
                        {option.points > 0 && answers[currentVisibleQuestion.id] === option.value && (
                            <span className="text-[8px] font-black text-primary mt-1 uppercase tracking-tighter">+{option.points} Pontos de Impacto</span>
                        )}
                    </div>
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
                    {currentVisibleQuestion.options.map((option: any, idx: number) => (
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
                  disabled={answers[currentVisibleQuestion.id] === undefined || answers[currentVisibleQuestion.id] === '' || isFinishing || !diagnosticId}
                  isLoading={isFinishing && !showSuccess} className={`px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all duration-300
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
                    Seu diagnóstico foi registrado. Desbloqueando trilha Ambiental...
                  </p>
                </div>
              </div>
            )}

            {currentVisibleQuestion.options?.find((o: any) => o.value === answers[currentVisibleQuestion.id])?.message && (
                <div className="bg-primary/5 border-2 border-dashed border-primary/20 p-8 rounded-3xl">
                  <div className="flex gap-6">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                      <Lightbulb size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white mb-1 uppercase tracking-widest text-xs">Informação Relevante</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        {currentVisibleQuestion.options.find((o: any) => o.value === answers[currentVisibleQuestion.id])?.message}
                      </p>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

