
import React, { useState, useContext, useRef } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToastContext } from '../contexts/ToastContext'; // UPDATED IMPORT
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TEAMS, SUPERVISORS, CURRENT_SHIFT_ASSIGNMENTS, ShiftType, EMPLOYEES_TEAM1, EMPLOYEES_TEAM2, EMPLOYEES_TEAM3, EMPLOYEES_TEAM4 } from '../constants'; // Added ShiftType & Employee arrays
import { CalendarDaysIcon, ShareIcon, PrinterIcon, SparklesIcon, DocumentArrowDownIcon, LightBulbIcon, CameraIcon } from '@heroicons/react/24/outline';
import { Language, TranslationSet, ShiftSuggestion, Employee } from '../types'; 

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI for Shift Scheduler:", e);
    ai = null;
  }
}

export const AiShiftSchedulerView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const scheduleContentRef = useRef<HTMLDivElement>(null);

  const teamOptions = TEAMS.map(team => ({ value: team.id, label: team.name }));
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const occasionOptions: { value: string; labelKey: keyof TranslationSet }[] = [
    { value: 'EidFitr', labelKey: 'aiShiftSchedulerOccasionEidFitr' },
    { value: 'EidAdha', labelKey: 'aiShiftSchedulerOccasionEidAdha' },
    { value: 'Wedding', labelKey: 'aiShiftSchedulerOccasionWedding' },
    { value: 'Emergency', labelKey: 'aiShiftSchedulerOccasionEmergency' },
    { value: 'Ramadan', labelKey: 'aiShiftSchedulerOccasionRamadan'},
    { value: 'NewYear', labelKey: 'aiShiftSchedulerOccasionNewYear'},
    { value: 'ShamNessim', labelKey: 'aiShiftSchedulerOccasionShamNessim'},
    { value: 'LaborDay', labelKey: 'aiShiftSchedulerOccasionLaborDay'},
    { value: 'RevolutionDay', labelKey: 'aiShiftSchedulerOccasionRevolutionDay'},
    { value: 'ArmedForcesDay', labelKey: 'aiShiftSchedulerOccasionArmedForcesDay'},
    { value: 'ProphetBirthday', labelKey: 'aiShiftSchedulerOccasionProphetBirthday'},
  ];

  const [selectedTeam, setSelectedTeam] = useState<string>(teamOptions[0]?.value || '');
  const [selectedOccasion, setSelectedOccasion] = useState<string>(occasionOptions[0]?.value || '');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [scheduleSuggestion, setScheduleSuggestion] = useState<ShiftSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; 
                const day = parseInt(parts[2]);
                const localDate = new Date(Date.UTC(year, month, day)); 
                 if (!isNaN(localDate.getTime())) {
                    return localDate.toLocaleDateString(language === Language.AR ? 'ar-EG-u-nu-latn' : 'en-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC' 
                    });
                }
            }
            return dateString; 
        }
        return date.toLocaleDateString(language === Language.AR ? 'ar-EG-u-nu-latn' : 'en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: dateString.includes('T') ? undefined : 'UTC' 
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return dateString; 
    }
};

  const getTeamMembersString = (teamId: string): string => {
    let employees: Employee[] = [];
    if (teamId === 'team1') employees = EMPLOYEES_TEAM1;
    else if (teamId === 'team2') employees = EMPLOYEES_TEAM2;
    else if (teamId === 'team3') employees = EMPLOYEES_TEAM3;
    else if (teamId === 'team4') employees = EMPLOYEES_TEAM4;
    return employees.map(e => e.name).join('، ') || (language === Language.AR ? 'لا يوجد أعضاء حالياً' : 'No members currently');
  };


  const handleSuggestSchedule = async () => {
    if (!selectedTeam || !selectedOccasion) {
      addToast(language === 'ar' ? 'يا ريس، اختار الفريق والمناسبة والسنة الأول!' : 'Boss, select the team, occasion, and year first!', 'alert');
      return;
    }
     if (!ai) {
      addToast(t('aiFeatureApiKeyMissing'), 'alert');
      const teamObject = TEAMS.find(tm => tm.id === selectedTeam);
      const teamName = teamObject?.name || selectedTeam;
      const supervisor = SUPERVISORS.find(s => s.id === teamObject?.supervisorId);
      const supervisorName = supervisor?.name || (language === 'ar' ? 'المشرف المسؤول' : 'The Supervisor');
      const teamMembersString = getTeamMembersString(selectedTeam);
      const occasionLabelKey = occasionOptions.find(o => o.value === selectedOccasion)?.labelKey || 'aiShiftSchedulerOccasionEidFitr';
      const occasionName = t(occasionLabelKey);
      
      setScheduleSuggestion({
        introduction: language === 'ar' ? `*** اقتراح وردية تجريبي من الفهلوي العظيم لسنة ${selectedYear} ***\nيا صباح القشطة يا كبير المعلمين! بمناسبة ${occasionName} السعيدة لفريق ${teamName} (اللي مشرفهم العسل ${supervisorName} ومعاه الرجالة: ${teamMembersString})، الفهلوي بنفسه جابلك خطة ورديات لوز اللوز، عشان الشغل ميعطلش والرجالة تاخد حقها في الفرحة:` : `*** Mock Shift Proposal from the Great Fahlawy for ${selectedYear} ***\nGreetings, chief of chiefs! For the joyous occasion of ${occasionName} for team ${teamName} (supervised by the great ${supervisorName} with his heroes: ${teamMembersString}), Fahlawy himself has brought you a top-notch shift plan, so work doesn't stop and the men get their share of happiness:`,
        special_period_details: {
          start_date: `${selectedYear}-07-15`,
          end_date: `${selectedYear}-07-17`,
          reason: occasionName,
          team_on_leave: `${teamName} (بقيادة ${supervisorName} ومعاه الفريق: ${teamMembersString})`
        },
        schedule_adjustments: [
          { date: `${selectedYear}-07-15`, day_of_week: language === 'ar' ? "الاثنين" : "Monday", morning_shift_team: "فريق النسور (تغطية مكان فريق الأبطال)", evening_shift_team: "فريق الوحوش (تغطية مكان فريق العتاولة)", notes: language === 'ar' ? `فريق ${teamName} (بقيادة ${supervisorName} والفريق بتاعه: ${teamMembersString}) في إجازة سعيدة. فريق الأبطال هيرجع يوم ${selectedYear}-07-18. فريق العتاولة هيخلص تغطية يوم ${selectedYear}-07-17 ويرجع لورديته الطبيعية.` : `Team ${teamName} (led by ${supervisorName} and his team: ${teamMembersString}) on happy leave. Team Al-Abtal returns on ${selectedYear}-07-18. Team Al-Atawla finishes coverage on ${selectedYear}-07-17 and returns to their normal shift.`},
          { date: `${selectedYear}-07-16`, day_of_week: language === 'ar' ? "الثلاثاء" : "Tuesday", morning_shift_team: "فريق الوحوش (تغطية مكان فريق الأبطال)", evening_shift_team: "فريق النسور (تغطية مكان فريق العتاولة)", notes: language === 'ar' ? `يوم كله بركة إن شاء الله. فريق الأبطال هيستلم الشغل تاني يوم ${selectedYear}-07-18. فريق العتاولة جاهز لورديته من يوم ${selectedYear}-07-17 بالليل.` : `A blessed day, Insha'Allah. Team Al-Abtal resumes work on ${selectedYear}-07-18. Team Al-Atawla is ready for their shift from the night of ${selectedYear}-07-17.`}
        ],
        return_to_normal_plan: [
           { date: `${selectedYear}-07-18`, day_of_week: language === 'ar' ? "الأربعاء" : "Wednesday", morning_shift_team: teamName, evening_shift_team: "فريق الوحوش", notes: language === 'ar' ? `عودة حميدة لفريق ${teamName} بقيادة الفخم ${supervisorName} ورجالته الأبطال (${teamMembersString})! النور قطع في غيابكوا يا وحوش. كل واحد يرجع لورديته الأصلية زي ما كانت قبل الإجازة السعيدة دي.` : `Welcome back ${teamName} led by the magnificent ${supervisorName} and his champion members (${teamMembersString})! The lights went out in your absence, champs. Everyone returns to their original shift as it was before this happy leave.` }
        ],
        conclusion: language === 'ar' ? 'وكده الشغل يمشي زي الفل، والكل راضي ومتكيف! شغل الـ API يا ريس عشان تشوف الفن على أصوله، ومتنساش حلاوة الفهلوي.' : 'And work will run like a charm, everyone content and happy! Turn on the API, boss, to see art in its truest form, and don\'t forget Fahlawy\'s tip.'
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setScheduleSuggestion(null);

    const teamObject = TEAMS.find(tm => tm.id === selectedTeam);
    const teamName = teamObject?.name || selectedTeam;
    const supervisor = SUPERVISORS.find(s => s.id === teamObject?.supervisorId);
    const supervisorName = supervisor?.name || (language === 'ar' ? 'المشرف المسؤول' : 'The Supervisor');
    const teamMembersString = getTeamMembersString(selectedTeam);
    
    const occasionLabelKey = occasionOptions.find(o => o.value === selectedOccasion)?.labelKey || 'aiShiftSchedulerOccasionEidFitr';
    const occasionName = t(occasionLabelKey);
    
    let dynamicCurrentShiftsContext = "";
    if (language === Language.AR) {
        dynamicCurrentShiftsContext = "الوضع الحالي للورديات يا فهلوي: ";
        dynamicCurrentShiftsContext += CURRENT_SHIFT_ASSIGNMENTS.map(sa => {
            const currentTeam = TEAMS.find(t => t.id === sa.teamId);
            const currentSupervisor = SUPERVISORS.find(s => s.id === currentTeam?.supervisorId);
            const currentTeamMembers = getTeamMembersString(sa.teamId);
            let shiftStatus = "";
            if (sa.shiftType === ShiftType.Morning) shiftStatus = `(صباحي، المشرف: ${currentSupervisor?.name || 'غير محدد'}، الأعضاء: ${currentTeamMembers})`;
            else if (sa.shiftType === ShiftType.Evening) shiftStatus = `(مسائي، المشرف: ${currentSupervisor?.name || 'غير محدد'}، الأعضاء: ${currentTeamMembers})`;
            else shiftStatus = "(إجازة)";
            return `${currentTeam?.name || sa.teamId} ${shiftStatus}`;
        }).join("؛ ");
    } else {
        dynamicCurrentShiftsContext = "Current shift assignments, Fahlawy: ";
        dynamicCurrentShiftsContext += CURRENT_SHIFT_ASSIGNMENTS.map(sa => {
            const currentTeam = TEAMS.find(t => t.id === sa.teamId);
            const currentSupervisor = SUPERVISORS.find(s => s.id === currentTeam?.supervisorId);
            const currentTeamMembers = getTeamMembersString(sa.teamId);
            let shiftStatus = "";
            if (sa.shiftType === ShiftType.Morning) shiftStatus = `(Morning, Supervisor: ${currentSupervisor?.name || 'N/A'}, Members: ${currentTeamMembers})`;
            else if (sa.shiftType === ShiftType.Evening) shiftStatus = `(Evening, Supervisor: ${currentSupervisor?.name || 'N/A'}, Members: ${currentTeamMembers})`;
            else shiftStatus = "(Off Duty)";
            return `${currentTeam?.name || sa.teamId} ${shiftStatus}`;
        }).join("; ");
    }


    const commonInstructions = `
النقاط المهمة جداً يا فهلوي الكون:
1.  الإجابة لازم تكون JSON صافي من غير أي كلام زيادة قبلها أو بعدها.
2.  كل التواريخ لازم تكون بصيغة "YYYY-MM-DD" وتتضمن السنة المحددة للمناسبة وهي (${selectedYear}).
3.  مدة الإجازة المقترحة تكون مناسبة للمناسبة (يومين أو تلاتة كفاية أوي).
4.  لازم يكون فيه فريق شغال صباحي وفريق مسائي ٢٤/٧، يعني مفيش وقت المصنع يقف.
5.  استخدم أسماء الفرق الحقيقية اللي عندك في السياق: (${TEAMS.map(tm => tm.name).join('، ')}).
6.  لازم تشرح بالتفصيل خطة عودة الفريق صاحب الإجازة للعمل (فريق "${teamName}" بقيادة "${supervisorName}" ومعاه أعضاءه: ${teamMembersString})، ومين هيغطيهم وإمتى، ومين من الفرق اللي غطت هيرجع لورديته الأصلية وإمتى. عايزين تفاصيل دقيقة يا عم الفهلوي.
7.  كل الكلام لازم يكون باللهجة المصرية العامية الكوميدية الأصيلة اللي بتوقع من الضحك.
8.  تأكد إن الـ JSON بتاعك سليم 100% ومفيهوش غلطات إملائية أو في التركيب.
9.  في "notes" بتاعة "schedule_adjustments" و "return_to_normal_plan"، اشرح مين بيغطي مين ومين بيرجع إمتى، بشكل واضح ومسلي، مع ذكر السنة (${selectedYear}) بوضوح عند ذكر التواريخ، وذكر اسم المشرف (${supervisorName}) وأعضاء فريق ${teamName} (${teamMembersString}) لما تتكلم عنهم.
`;

const arabicPrompt = `يا أسطى فهلوي يا برنس تظبيط الورديات في المجرة كلها!
${dynamicCurrentShiftsContext}.
عندنا فريق اسمه "${teamName}" بقيادة المشرف الفذ "${supervisorName}" ومعاه أعضاء الفريق الأبطال: ${teamMembersString}. الفريق ده عايز ياخد إجازة لمدة يومين تلاتة كده بمناسبة "${occasionName}" في سنة ${selectedYear}.
مطلوب من معاليك اقتراح تعديل على جدول الورديات يكون عبقري وعادل وميوقفش حال المصنع. عاوزين شرح مفصل وكوميدي لعملية الترحيل والعودة للورديات، مع ذكر اسم المشرف (${supervisorName}) وأعضاء فريق الإجازة (${teamMembersString}).

خرج الاقتراح بتاعك في صيغة JSON فقط لا غير، بالشكل ده بالظبط:
{
  "introduction": "مقدمة كوميدية جداً بالعامية المصرية، زي مثلاً: يا مساء الفل والياسمين على أحلى مهندسين! الفهلوي بتاعكوا جهز خطة ورديات لسنة ${selectedYear} تخلي ${occasionName} بتاعة فريق '${teamName}' (اللي مشرفهم الأسد ${supervisorName} ورجالته الجامدين: ${teamMembersString}) تعدي زي الشعرة من العجين، والشغل برضه ماشي تمام التمام. الخطة بتقول:",
  "special_period_details": {
    "start_date": "YYYY-MM-DD (تاريخ بداية الإجازة المقترحة، لازم السنة تكون ${selectedYear})",
    "end_date": "YYYY-MM-DD (تاريخ نهاية الإجازة المقترحة، لازم السنة تكون ${selectedYear})",
    "reason": "${occasionName}",
    "team_on_leave": "${teamName} (بقيادة ${supervisorName} والأعضاء: ${teamMembersString})"
  },
  "schedule_adjustments": [
    {"date": "YYYY-MM-DD", "day_of_week": "اسم اليوم بالعربي", "morning_shift_team": "اسم الفريق اللي هيشتغل الصبح", "evening_shift_team": "اسم الفريق اللي هيشتغل بالليل", "notes": "شرح كوميدي ومفصل مين بيغطي مين ولفترة قد إيه، مثلاً: فريق ${teamName} (بقيادة ${supervisorName} والأعضاء: ${teamMembersString}) واخدين إجازة النهاردة عشان يلحقوا اللحمة في سنة ${selectedYear}، فريق الأبطال هيشيلوا الليلة الصبح، وفريق الوحوش ماسكينها بالليل. كله تحت السيطرة يا رجالة!"},
    {"date": "YYYY-MM-DD", "day_of_week": "اسم اليوم", "morning_shift_team": "...", "evening_shift_team": "...", "notes": "ملاحظة تانية فكاهية ومفصلة عن التغطية لسنة ${selectedYear} مع ذكر أسماء المشرفين وأعضاء الفرق لو أمكن"}
  ],
  "return_to_normal_plan": [
    {"date": "YYYY-MM-DD (أول يوم بعد الإجازة)", "day_of_week": "اسم اليوم", "morning_shift_team": "${teamName} (راجعين بقوة بقيادة ${supervisorName} ومعاهم ${teamMembersString}!)", "evening_shift_team": "الفريق التاني حسب الجدول الطبيعي", "notes": "شرح كوميدي ومفصل لعودة فريق ${teamName} للعمل في سنة ${selectedYear}، وانتهاء تغطية الفرق الأخرى وعودتهم لجداولهم الطبيعية، مثلاً: حمدالله على السلامة يا وحوش فريق ${teamName} ومشرفهم الهمام ${supervisorName} وأعضائه الأبطال (${teamMembersString})! النور رجع للمكان برجوعكم. فريق الأبطال شكراً على التغطية، ارجعوا لوردية الصبح بتاعتكم زي زمان. وفريق الوحوش، كتر خيركم، استريحوا انتوا النهاردة عشان بكرة عندكم شغل."}
  ],
  "conclusion": "خاتمة كوميدية جداً زي: وكده يبقى كله تمام ومية فل وعشرة، الشغل ماشي والناس فرحانة! لو الخطة دي عجبت الريس، يبقى الفهلوي ده نمبر وان! متنسوش بس تراجعوا الـ JSON ده كويس قبل ما تبعتوه."
}
${commonInstructions}
`;

const englishPrompt = `You are "El Fahlawy," the ultimate shift scheduling guru for UGDC Damietta petroleum plant!
${dynamicCurrentShiftsContext}.
Urgent Mission: Team "${teamName}" (supervised by the great "${supervisorName}" with team members: ${teamMembersString}) needs leave for a few days (2-3 days typically) due to the "${occasionName}" occasion in the year ${selectedYear}.
Propose a logical and fair shift schedule adjustment that ensures 24/7 plant operation. Provide a detailed and comedic explanation in Egyptian Arabic for the handover and return to normal shifts, mentioning supervisor ${supervisorName} and team members ${teamMembersString} of the leaving team.

Output: ONLY a valid JSON object, no extra text or markdown. The structure must be exactly:
{
  "introduction": "A very comedic Egyptian Arabic intro, e.g., Good evening of jasmine and roses to the best engineers! Your Fahlawy has prepared a shift plan for year ${selectedYear} to make team '${teamName}'s (led by the lion ${supervisorName} and his mighty members: ${teamMembersString}) ${occasionName} go as smooth as silk, and work keeps running perfectly. The plan says:",
  "special_period_details": {
    "start_date": "YYYY-MM-DD (Proposed leave start date, year must be ${selectedYear})",
    "end_date": "YYYY-MM-DD (Proposed leave end date, year must be ${selectedYear})",
    "reason": "${occasionName}",
    "team_on_leave": "${teamName} (supervised by ${supervisorName}, members: ${teamMembersString})"
  },
  "schedule_adjustments": [
    {"date": "YYYY-MM-DD", "day_of_week": "Day name in English", "morning_shift_team": "Team working morning", "evening_shift_team": "Team working evening", "notes": "Detailed and comedic explanation of who covers whom and for how long, e.g., Team ${teamName} (with ${supervisorName} and members: ${teamMembersString}) is on leave today to catch the meat in year ${selectedYear}, Team Al-Abtal will cover the morning shift, and Team Al-Wuhush are holding it down at night. Everything's under control, guys!"},
    {"date": "YYYY-MM-DD", "day_of_week": "Day name", "morning_shift_team": "...", "evening_shift_team": "...", "notes": "Another funny and detailed note about coverage for year ${selectedYear}, mentioning supervisors and team members if possible"}
  ],
  "return_to_normal_plan": [
    {"date": "YYYY-MM-DD (First day after leave)", "day_of_week": "Day name", "morning_shift_team": "${teamName} (Returning strong with ${supervisorName} and members ${teamMembersString}!)", "evening_shift_team": "Other team per normal schedule", "notes": "Detailed and comedic explanation of team ${teamName}'s return to work in year ${selectedYear} (with supervisor ${supervisorName} and members ${teamMembersString}), and the end of coverage for other teams and their return to their normal schedules, e.g., Welcome back, champions of team ${teamName}, their great supervisor ${supervisorName}, and members ${teamMembersString}! The place lit up with your return. Team Al-Abtal, thanks for the coverage, go back to your morning shift as usual. And Team Al-Wuhush, much appreciated, take a rest today because you have work tomorrow."}
  ],
  "conclusion": "A very comedic conclusion, e.g., And so, everything is perfect and a hundred percent, work is flowing and people are happy! If the boss likes this plan, then this Fahlawy is number one! Just don't forget to double-check this JSON before sending it."
}
${commonInstructions.replace(/\$\{currentYear\}/g, selectedYear.toString())}
Remember, if the request is in English, the "day_of_week" should be in English. The rest of the content, especially "notes", "introduction", and "conclusion", must be comedic Egyptian Arabic.
`;
    
    const prompt = language === 'ar' ? arabicPrompt : englishPrompt;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      const parsedData = JSON.parse(jsonStr) as ShiftSuggestion;
      if (parsedData.schedule_adjustments && Array.isArray(parsedData.schedule_adjustments)) {
         setScheduleSuggestion(parsedData);
      } else {
        console.error("Invalid schedule data structure from AI:", parsedData);
        setError(t('aiShiftSchedulerError'));
        addToast(t('aiShiftSchedulerError'), 'alert');
      }
    } catch (err) {
      console.error("Error fetching schedule suggestion from AI:", err);
      setError(t('aiShiftSchedulerError'));
      addToast(t('aiShiftSchedulerError'), 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (actionType: 'PDF' | 'Share' | 'Print' | 'Screenshot') => {
    let currentMessageKey: keyof TranslationSet = 'statusSuccessMessage'; 
    let currentToastType: 'success' | 'info' | 'alert' = 'success';

    if (actionType === 'Screenshot') {
      currentMessageKey = 'screenshotSuccess'; 
      currentToastType = 'info';
      addToast(t(currentMessageKey) + " (" + (language === 'ar' ? "استخدم لقطة شاشة النظام لو سمحت." : "Please use your system's screenshot tool.") + ")", currentToastType);
      return;
    }

    if (!scheduleSuggestion || !scheduleContentRef.current) {
        addToast(t('aiShiftSchedulerNoSuggestionYet'), 'alert');
        return;
    }
    
    const contentToPrint = scheduleContentRef.current.innerHTML;

    if (actionType === 'PDF' || actionType === 'Print') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>' + t('aiShiftSchedulerSuggestionResultTitle') + '</title>');
            printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">');
            printWindow.document.write(`<style>body{font-family:"Cairo",sans-serif;direction:${language === 'ar' ? 'rtl' : 'ltr'};padding:20px;margin:0;font-size:16px;line-height:1.8;} h1,h2,h3,p,li{text-align:${language === 'ar' ? 'right' : 'left'};} h1{font-size:1.8em;color:#D97706;margin-bottom:1em;} h2{font-size:1.5em;color:#1E3A8A;margin-top:1em;margin-bottom:0.5em;} .schedule-section{margin-bottom:1.5em;padding:15px;border:1px solid #E5E7EB;border-radius:8px;} .schedule-item{margin-bottom:1em;padding-bottom:1em;border-bottom:1px dashed #EEE;} .schedule-item:last-child{border-bottom:none;} .notes{font-style:italic;color:#555;font-size:0.95em;}strong{color:#059669;}</style></head><body>`);
            printWindow.document.write(contentToPrint);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            if (actionType === 'Print') {
                 setTimeout(() => { if(printWindow) { printWindow.print(); printWindow.close(); } }, 250);
            }
            currentMessageKey = actionType === 'PDF' ? 'exportSuccess' : 'printSuccess';
        } else {
            currentMessageKey = 'featureUnderConstruction'; 
            currentToastType = 'alert';
        }
    } else if (actionType === 'Share') {
        if (navigator.share && scheduleContentRef.current) {
            navigator.share({
                title: t('aiShiftSchedulerSuggestionResultTitle'),
                text: scheduleContentRef.current.innerText.substring(0, 200) + "...", 
            }).then(() => {
                addToast(t('shareSuccess'), 'success');
            }).catch(console.error);
            return; 
        } else {
            currentMessageKey = 'shareSuccess'; 
        }
    }
    addToast(t(currentMessageKey), currentToastType);
  };

  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const cardBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputBaseClasses = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 text-sm";
  const themedInputClasses = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-600 focus:border-blue-600';
  const buttonClasses = `w-full py-3 px-5 rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`;
  
  const suggestionBoxBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80';
  const suggestionItemBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const actionButtonClasses = `flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-colors shadow-sm hover:shadow-md ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
  const suggestionTextColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const suggestionNoteColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const contentFontSize = language === 'ar' ? 'text-lg' : 'text-base';

  return (
    <div className={`p-2 md:p-4 ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <div className="flex items-center mb-6">
        <CalendarDaysIcon className={`h-8 w-8 ${pageTitleColor} ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('aiShiftSchedulerTitle')}
        </h1>
      </div>

      <div className={`p-5 md:p-6 rounded-xl shadow-xl mb-6 ${cardBg} border`}>
        <div className="space-y-4">
          <div>
            <label htmlFor="selectTeam" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('aiShiftSchedulerSelectTeamLabel')}</label>
            <select id="selectTeam" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`}>
              {teamOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="selectOccasion" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('aiShiftSchedulerSelectOccasionLabel')}</label>
                <select id="selectOccasion" value={selectedOccasion} onChange={(e) => setSelectedOccasion(e.target.value)} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {occasionOptions.map(option => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="selectYear" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('aiShiftSchedulerOccasionYearLabel')}</label>
                <select id="selectYear" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className={`${inputBaseClasses} ${themedInputClasses}`}>
                {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
            </div>
          </div>
          <button onClick={handleSuggestSchedule} className={buttonClasses} disabled={isLoading}>
            {isLoading ? (
              <><SparklesIcon className="h-5 w-5 inline animate-spin mr-2 rtl:ml-2" />{t('aiShiftSchedulerLoadingSuggestion')}</>
            ) : (
              <><LightBulbIcon className="h-5 w-5 inline mr-2 rtl:ml-2" />{t('aiShiftSchedulerSuggestButton')}</>
            )}
          </button>
        </div>
      </div>

      {(scheduleSuggestion || isLoading || error) && (
        <div className={`p-5 md:p-6 rounded-xl shadow-xl ${cardBg} border`}>
          <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('aiShiftSchedulerSuggestionResultTitle')}
          </h2>
          {isLoading && <p className={`text-center py-4 text-sm ${suggestionTextColor}`}>{t('aiShiftSchedulerLoadingSuggestion')}...</p>}
          {error && <p className={`text-center py-4 text-sm text-red-500 dark:text-red-400`}>{error}</p>}
          {!isLoading && !scheduleSuggestion && !error && <p className={`text-center py-4 text-sm ${suggestionTextColor}`}>{t('aiShiftSchedulerNoSuggestionYet')}</p>}
          
          {!isLoading && scheduleSuggestion && (
            <div ref={scheduleContentRef} className={`p-4 rounded-lg ${suggestionBoxBg} ${suggestionTextColor} ${contentFontSize} leading-relaxed`}>
              {scheduleSuggestion.introduction && <p className={`mb-4 italic ${language === 'ar' ? 'text-xl' : 'text-lg'}`}>{scheduleSuggestion.introduction}</p>}
              
              {scheduleSuggestion.special_period_details && (
                <div className={`mb-5 p-4 rounded-md ${suggestionItemBg} shadow`}>
                  <h3 className={`font-semibold ${language === 'ar' ? 'text-2xl' : 'text-xl'} mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>{language === 'ar' ? 'فترة المناسبة الخاصة:' : 'Special Occasion Period:'}</h3>
                  <p className="my-1">{language === 'ar' ? 'السبب:' : 'Reason:'} {scheduleSuggestion.special_period_details.reason}</p>
                  <p className="my-1">{language === 'ar' ? 'الفريق صاحب الإجازة:' : 'Team on Leave:'} {scheduleSuggestion.special_period_details.team_on_leave || 'N/A'}</p>
                  <p className="my-1">{language === 'ar' ? 'من تاريخ:' : 'From:'} {formatDate(scheduleSuggestion.special_period_details.start_date)}</p>
                  <p className="my-1">{language === 'ar' ? 'إلى تاريخ:' : 'To:'} {formatDate(scheduleSuggestion.special_period_details.end_date)}</p>
                </div>
              )}

              <h3 className={`font-semibold ${language === 'ar' ? 'text-2xl' : 'text-xl'} mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{language === 'ar' ? 'تعديلات الجدول المقترحة:' : 'Proposed Schedule Adjustments:'}</h3>
              <div className="space-y-4">
                {scheduleSuggestion.schedule_adjustments.map((adj, index) => (
                  <div key={index} className={`p-4 rounded-md shadow ${suggestionItemBg}`}>
                    <p><strong>{formatDate(adj.date)} ({adj.day_of_week})</strong></p>
                    <p>{t('morningShift')}: <span className="font-medium">{adj.morning_shift_team}</span></p>
                    <p>{t('eveningShift')}: <span className="font-medium">{adj.evening_shift_team}</span></p>
                    <p className={`mt-2 italic ${suggestionNoteColor} ${language === 'ar' ? 'text-lg' : 'text-md'}`}>{adj.notes}</p>
                  </div>
                ))}
              </div>

              {scheduleSuggestion.return_to_normal_plan && scheduleSuggestion.return_to_normal_plan.length > 0 && (
                <>
                  <h3 className={`font-semibold ${language === 'ar' ? 'text-2xl' : 'text-xl'} mt-6 mb-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{language === 'ar' ? 'خطة العودة للجدول الطبيعي:' : 'Return to Normal Schedule Plan:'}</h3>
                  <div className="space-y-4">
                    {scheduleSuggestion.return_to_normal_plan.map((adj, index) => (
                      <div key={`return-${index}`} className={`p-4 rounded-md shadow ${suggestionItemBg}`}>
                        <p><strong>{formatDate(adj.date)} ({adj.day_of_week})</strong></p>
                        <p>{t('morningShift')}: <span className="font-medium">{adj.morning_shift_team}</span></p>
                        <p>{t('eveningShift')}: <span className="font-medium">{adj.evening_shift_team}</span></p>
                        <p className={`mt-2 italic ${suggestionNoteColor} ${language === 'ar' ? 'text-lg' : 'text-md'}`}>{adj.notes}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {scheduleSuggestion.conclusion && <p className={`mt-6 italic font-semibold ${language === 'ar' ? 'text-xl' : 'text-lg'} ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{scheduleSuggestion.conclusion}</p>}
            
              <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 flex flex-wrap gap-2 sm:gap-3 justify-center">
                <button onClick={() => handleAction('PDF')} className={actionButtonClasses}><DocumentArrowDownIcon className="h-4 w-4"/> {t('aiShiftSchedulerExportPDF')}</button>
                <button onClick={() => handleAction('Share')} className={actionButtonClasses}><ShareIcon className="h-4 w-4"/>{t('aiShiftSchedulerShare')}</button>
                <button onClick={() => handleAction('Print')} className={actionButtonClasses}><PrinterIcon className="h-4 w-4"/>{t('aiShiftSchedulerPrint')}</button>
                <button onClick={() => handleAction('Screenshot')} className={actionButtonClasses}><CameraIcon className="h-4 w-4"/>{t('aiShiftSchedulerScreenshot')}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
