'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  const [cleanedData, setCleanedData] = useState<any[]>([])
  const [courseWiseData, setCourseWiseData] = useState<any[]>([])

  useEffect(() => {
    const storedData = localStorage.getItem('attendanceData')
    if (!storedData) {
      router.push('/login')
      return
    }
    const parsedData = JSON.parse(storedData)
    setData(parsedData)

    // Process and filter data based on user request
    if (parsedData.attendance_data && parsedData.attendance_data.length > 0) {
      const firstRow = parsedData.attendance_data[0];
      const keys = Object.keys(firstRow);
      
      const codeKey = keys.find(k => /code/i.test(k)) || keys.find(k => k.includes('Code'));
      
      // Improved description key detection
      let descKey = keys.find(k => 
        (/description|title|name|subject|course/i.test(k)) && 
        !/code/i.test(k) && 
        k !== codeKey
      );

      // Fallback
      if (!descKey && keys.length > 2) {
         const candidate = keys[1];
         if (candidate !== codeKey && !/ltps|total|present/i.test(candidate)) {
             descKey = candidate;
         } else if (keys[2] && keys[2] !== codeKey && !/ltps|total|present/i.test(keys[2])) {
             descKey = keys[2];
         }
      }

      const ltpsKey = keys.find(k => /ltps|structure|periods|l-t-p-s/i.test(k));
      const attendedKey = keys.find(k => /attended|present/i.test(k));
      const conductedKey = keys.find(k => /conducted|total|held/i.test(k));

      const filtered = parsedData.attendance_data.map((row: any) => ({
        "Course Code": row[codeKey || ''] || '',
        "Course Description": row[descKey || ''] || '',
        "LTPS": row[ltpsKey || ''] || '-',
        "Total Attended": row[attendedKey || ''] || '',
        "Total Conducted": row[conductedKey || ''] || ''
      }));
      
      setCleanedData(filtered);

      // Group by Course Code and Calculate LTPS
      try {
        const groups: { [key: string]: any[] } = {};
        filtered.forEach((item: any) => {
          const code = item["Course Code"];
          if (code) {
             if (!groups[code]) groups[code] = [];
             groups[code].push(item);
          }
        });

        const calculatedCourses = Object.keys(groups).map(code => {
          const items = groups[code];
          const description = items[0]["Course Description"];
          
          const components: any = {
            Lecture: { weight: 1.0, attended: 0, conducted: 0 },
            Tutorial: { weight: 0.25, attended: 0, conducted: 0 },
            Practical: { weight: 0.5, attended: 0, conducted: 0 },
            Skilling: { weight: 0.25, attended: 0, conducted: 0 }
          };

          items.forEach((item: any) => {
            const ltpsRaw = (item["LTPS"] || '').toLowerCase().trim();
            let type = '';
            if (ltpsRaw.includes('lecture') || ltpsRaw.startsWith('l')) type = 'Lecture';
            else if (ltpsRaw.includes('tutorial') || ltpsRaw.startsWith('t')) type = 'Tutorial';
            else if (ltpsRaw.includes('practical') || ltpsRaw.startsWith('p')) type = 'Practical';
            else if (ltpsRaw.includes('skilling') || ltpsRaw.startsWith('s')) type = 'Skilling';

            if (type && components[type]) {
               const attended = parseFloat(item["Total Attended"]) || 0;
               const conducted = parseFloat(item["Total Conducted"]) || 0;
               components[type].attended += attended;
               components[type].conducted += conducted;
            }
          });

          let weightedSum = 0;
          let totalWeight = 0;
          
          Object.values(components).forEach((comp: any) => {
              if (comp.conducted > 0) {
                  weightedSum += (comp.attended / comp.conducted) * comp.weight;
                  totalWeight += comp.weight;
              }
          });

          const finalPercentage = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;

          return {
            code,
            description,
            components,
            finalPercentage,
            totalWeight
          };
        });

        setCourseWiseData(calculatedCourses);
      } catch (e: any) {
          console.error("Calculation error", e)
      }
    }
  }, [router])

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return { label: "Eligible", color: "text-green-600 dark:text-green-400", alert: "success" };
    if (percentage >= 75) return { label: "Conditional Eligibility", color: "text-yellow-600 dark:text-yellow-400", alert: "warning" };
    return { label: "Not Eligible", color: "text-red-600 dark:text-red-400", alert: "destructive" };
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center font-poppins text-lg">Loading...</div>

  return (
    <div className="container mx-auto p-8 max-w-5xl min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-foreground">Attendance Dashboard</h1>
            <motion.div 
                className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-red-500 via-red-400 to-red-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </div>
        <Button onClick={() => {
          localStorage.removeItem('attendanceData')
          router.push('/login')
        }} variant="outline" className="font-outfit hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">Logout</Button>
      </div>

      {/* Course-wise Calculated Attendance */}
       {courseWiseData && courseWiseData.length > 0 && (
         <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-1">
           {courseWiseData.map((course, index) => {
             const displayPercentage = Math.ceil(course.finalPercentage);
             const status = getAttendanceStatus(displayPercentage);
             return (
               <Card key={index} className={`border-l-4 ${displayPercentage >= 85 ? 'border-l-green-500' : displayPercentage >= 75 ? 'border-l-yellow-500' : 'border-l-red-500'} shadow-sm hover:shadow-md transition-shadow`}>
                 <CardHeader className="pb-2">
                   <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold font-poppins text-foreground/90">{course.description}</CardTitle>
                      <p className="text-sm font-outfit text-muted-foreground">{course.code}</p>
                    </div>
                    <div className="text-right">
                       <span className={`text-3xl font-bold font-outfit ${status.color}`}>
                         {displayPercentage}%
                       </span>
                       <p className={`text-xs font-medium font-outfit mt-1 ${status.color}`}>
                         {status.label}
                       </p>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 gap-6 mt-2">
                      {/* Component Breakdown */}
                      <div className="col-span-2 sm:col-span-1">
                         <h4 className="text-sm font-semibold mb-3 font-poppins text-foreground/80">Components</h4>
                         <div className="space-y-2">
                           {Object.entries(course.components).map(([key, val]: [string, any]) => (
                               val.conducted > 0 && (
                                   <div key={key} className="flex justify-between text-sm font-outfit items-center p-1">
                                       <span className="text-muted-foreground">{key} <span className="text-xs opacity-60 ml-1">(Weightage: {val.weight * 100}%)</span></span>
                                       <span className="font-medium font-mono">
                                           {val.attended}/{val.conducted} ({((val.attended/val.conducted)*100).toFixed(0)}%)
                                       </span>
                                   </div>
                               )
                           ))}
                         </div>
                      </div>

                      {/* Projections (Detailed for each course) */}
                      <div className="col-span-2 sm:col-span-1 sm:border-l border-foreground/10 sm:pl-6 pt-4 sm:pt-0">
                         <h4 className="text-sm font-semibold mb-3 font-poppins text-foreground/80">Projections</h4>
                         {(() => {
                           // Generic predict function
                           const predict = (targetType: string, addedAttended: number, addedMissed: number) => {
                                const comp = course.components;
                                let wSum = 0;
                                let tWeight = 0;

                                ['Lecture', 'Tutorial', 'Practical', 'Skilling'].forEach(key => {
                                    const c = comp[key];
                                    if (c.conducted > 0) {
                                        let att = c.attended;
                                        let cond = c.conducted;
                                        
                                        if (key === targetType) {
                                            att += addedAttended;
                                            cond += (addedAttended + addedMissed);
                                        }

                                        if (cond > 0) {
                                            wSum += (att / cond) * c.weight;
                                            tWeight += c.weight;
                                        }
                                    }
                                });
                                
                                return (tWeight > 0) ? (wSum / tWeight) * 100 : 0;
                           };
                           
                           const activeComponents = ['Lecture', 'Tutorial', 'Practical', 'Skilling'].filter(key => course.components[key].conducted > 0);

                           if (activeComponents.length === 0) return <span className="text-xs text-muted-foreground">No active components</span>;

                           const bunkSuggestions: React.ReactNode[] = [];
                           const attendSuggestions: React.ReactNode[] = [];

                           activeComponents.forEach(type => {
                               // 75% Check
                               if (displayPercentage >= 75) {
                                   let bunkable = 0;
                                   while (Math.ceil(predict(type, 0, bunkable + 1)) >= 75 && bunkable < 200) bunkable++;
                                   if (bunkable > 0) {
                                        const newAttended = course.components[type].attended;
                                        const newConducted = course.components[type].conducted + bunkable;
                                        bunkSuggestions.push(
                                           <div key={`${type}-75-bunk`} className="text-green-600 flex gap-2 items-center text-xs justify-between">
                                               <span><strong>{bunkable > 50 ? '>50' : bunkable}</strong> {type} <span className="text-muted-foreground text-[10px]">(maintain 75% overall)</span></span>
                                               <span className="opacity-70 text-[10px]">({newAttended}/{newConducted})</span>
                                           </div>
                                        );
                                   }
                               } else {
                                   let needed = 0;
                                   while (Math.ceil(predict(type, needed + 1, 0)) < 75 && needed < 200) needed++;
                                   if (Math.ceil(predict(type, needed, 0)) < 75) needed++;
                                   
                                   const newAttended = course.components[type].attended + needed;
                                   const newConducted = course.components[type].conducted + needed;
                                   
                                   attendSuggestions.push(
                                       <div key={`${type}-75-need`} className="text-yellow-600 flex gap-2 items-center text-xs justify-between">
                                           <span><strong>{needed > 50 ? '>50' : needed}</strong> {type} <span className="text-muted-foreground text-[10px]">(reach 75% overall)</span></span>
                                           <span className="opacity-70 text-[10px]">({newAttended}/{newConducted})</span>
                                       </div>
                                   );
                               }

                               // 85% Check
                               if (displayPercentage >= 85) {
                                   let bunkable = 0;
                                   while (Math.ceil(predict(type, 0, bunkable + 1)) >= 85 && bunkable < 200) bunkable++;
                                   if (bunkable > 0) {
                                        const newAttended = course.components[type].attended;
                                        const newConducted = course.components[type].conducted + bunkable;
                                        bunkSuggestions.push(
                                           <div key={`${type}-85-bunk`} className="text-green-600 flex gap-2 items-center text-xs justify-between">
                                               <span><strong>{bunkable > 50 ? '>50' : bunkable}</strong> {type} <span className="text-muted-foreground text-[10px]">(maintain 85% overall)</span></span>
                                               <span className="opacity-70 text-[10px]">({newAttended}/{newConducted})</span>
                                           </div>
                                        );
                                   }
                               } else {
                                   let needed = 0;
                                   while (Math.ceil(predict(type, needed + 1, 0)) < 85 && needed < 200) needed++;
                                   if (Math.ceil(predict(type, needed, 0)) < 85) needed++;
                                   
                                   const newAttended = course.components[type].attended + needed;
                                   const newConducted = course.components[type].conducted + needed;
                                   
                                   attendSuggestions.push(
                                       <div key={`${type}-85-need`} className="text-blue-600 flex gap-2 items-center text-xs justify-between">
                                           <span><strong>{needed > 50 ? '>50' : needed}</strong> {type} <span className="text-muted-foreground text-[10px]">(reach 85% overall)</span></span>
                                           <span className="opacity-70 text-[10px]">({newAttended}/{newConducted})</span>
                                       </div>
                                   );
                               }
                           });

                           return (
                               <div className="space-y-4">
                                   {bunkSuggestions.length > 0 && (
                                       <div>
                                            <h5 className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2 border-b pb-1">
                                                Safe to Bunk <span className="text-muted-foreground font-normal normal-case ml-1">(Any 1)</span>
                                            </h5>
                                            <div className="space-y-1 pl-1">
                                                {bunkSuggestions}
                                            </div>
                                       </div>
                                   )}
                                   
                                   {attendSuggestions.length > 0 && (
                                       <div>
                                            <h5 className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2 border-b pb-1">
                                                Need to Attend <span className="text-muted-foreground font-normal normal-case ml-1">(Any 1)</span>
                                            </h5>
                                            <div className="space-y-1 pl-1">
                                                {attendSuggestions}
                                            </div>
                                       </div>
                                   )}
                                   
                                   {bunkSuggestions.length === 0 && attendSuggestions.length === 0 && (
                                       <span className="text-xs text-muted-foreground">Maintained exactly on target.</span>
                                   )}
                               </div>
                           );
                       })()}
                    </div>
                 </div>
               </CardContent>
             </Card>
             )
           })}
         </div>
       )}

      {/* Debug Info Toggle Removed */}
    </div>
  )
}