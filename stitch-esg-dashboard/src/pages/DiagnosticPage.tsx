import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { diagnosticQuestions, Question } from '../data/questions';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, CheckCircle2, Save } from 'lucide-react';

export const DiagnosticPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);

  const totalQuestions = diagnosticQuestions.length;
  const currentQuestion = diagnosticQuestions[currentStep];
  const progress = ((currentStep + 1) / totalQuestions) * 100;

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
  }, [user]);

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

      navigate('/dashboard');
    } catch (err) {
      console.error("Error finishing diagnostic:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Diagnóstico ESG</h2>
            <span className="text-sm font-bold text-slate-500">Questão {currentStep + 1} de {totalQuestions}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <Card className="mb-8 min-h-[400px] flex flex-col justify-center relative">
           <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black uppercase tracking-wider text-slate-500">
             {currentQuestion.category}
           </div>
           
           <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 leading-tight">
             {currentQuestion.text}
           </h3>

           <div className="space-y-3">
             {currentQuestion.options.map((option, idx) => (
               <button
                 key={idx}
                 onClick={() => handleOptionSelect(option.value)}
                 className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                   ${answers[currentQuestion.id] === option.value
                     ? 'border-primary bg-primary/5 text-slate-900 dark:text-slate-100 shadow-lg shadow-primary/10'
                     : 'border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                   }
                 `}
               >
                 <span className="font-medium">{option.label}</span>
                 {answers[currentQuestion.id] === option.value && (
                   <CheckCircle2 className="text-primary" size={20} />
                 )}
               </button>
             ))}
           </div>
        </Card>

        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className="text-slate-500"
          >
            <ArrowLeft size={18} className="mr-2" /> Anterior
          </Button>

          <Button 
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined || saving}
            isLoading={saving}
            className="px-8"
          >
            {currentStep === totalQuestions - 1 ? 'Finalizar e Ver Resultado' : 'Próxima'}
            {currentStep !== totalQuestions - 1 && <ArrowRight size={18} className="ml-2" />}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
