import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertCircle, Bot } from "lucide-react";

const bmiRanges = [
  { min: 0, max: 18.5, status: "Underweight" },
  { min: 18.5, max: 24.9, status: "Normal" },
  { min: 25, max: 29.9, status: "Overweight" },
  { min: 30, max: 100, status: "Obese" },
];

const suggestions = {
  Underweight: {
    diet: [
      "Increase calorie intake with healthy foods",
      "Eat more protein-rich foods (eggs, dairy, legumes)",
      "Include nuts and healthy oils",
      "Eat frequent, balanced meals",
    ],
    exercise: [
      "Light strength training",
      "Yoga",
      "Avoid excessive cardio",
    ],
  },
  Overweight: {
    diet: [
      "Reduce sugary and fatty foods",
      "Eat more vegetables and fruits",
      "Choose whole grains",
      "Control portion sizes",
    ],
    exercise: [
      "Brisk walking",
      "Cycling",
      "Swimming",
      "Regular aerobic exercise",
    ],
  },
  Obese: {
    diet: [
      "Consult a nutritionist for a personalized plan",
      "Strictly limit processed foods",
      "Increase fiber intake",
      "Drink plenty of water",
    ],
    exercise: [
      "Start with low-impact activities",
      "Gradually increase activity level",
      "Consult a doctor before starting new exercise",
    ],
  },
};

const symptomSuggestions = {
  fever: {
    advice: "Take paracetamol, rest, and stay hydrated. If fever persists, consult a doctor.",
    tablets: ["Paracetamol 500mg"],
  },
  headache: {
    advice: "Take rest in a quiet, dark room. You may take a mild painkiller if needed.",
    tablets: ["Paracetamol 500mg", "Ibuprofen 200mg"],
  },
  cold: {
    advice: "Drink warm fluids, rest, and consider steam inhalation. Use decongestant if needed.",
    tablets: ["Cetirizine 10mg", "Paracetamol 500mg"],
  },
  cough: {
    advice: "Stay hydrated, use cough syrup if needed, and avoid cold drinks.",
    tablets: ["Cough syrup", "Paracetamol 500mg"],
  },
  stomachache: {
    advice: "Eat light food, avoid spicy items, and rest. If pain is severe, consult a doctor.",
    tablets: ["Dicyclomine 10mg", "Paracetamol 500mg"],
  },
};

function calculateBMI(weight: number, height: number) {
  // height in cm, weight in kg
  const h = height / 100;
  return +(weight / (h * h)).toFixed(1);
}

export default function StudentHealthChatbot() {
  const [step, setStep] = useState<"init" | "bmi" | "symptom" | "result">("init");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmiResult, setBmiResult] = useState<{ bmi: number; status: string } | null>(null);
  const [symptom, setSymptom] = useState("");
  const [symptomResult, setSymptomResult] = useState<{ advice: string; tablets: string[] } | null>(null);

  const handleBmiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bmi = calculateBMI(Number(weight), Number(height));
    let status = "Normal";
    for (const range of bmiRanges) {
      if (bmi >= range.min && bmi < range.max) {
        status = range.status;
        break;
      }
    }
    setBmiResult({ bmi, status });
    setStep("result");
  };

  const handleSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = symptom.trim().toLowerCase();
    setSymptomResult(symptomSuggestions[key] || null);
    setStep("result");
  };

  const reset = () => {
    setStep("init");
    setAge("");
    setWeight("");
    setHeight("");
    setBmiResult(null);
    setSymptom("");
    setSymptomResult(null);
  };

  return (
    <Card variant="elevated" className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-health-blue" />
          AI Health Assistant
        </CardTitle>
        <CardDescription>Get health suggestions and BMI advice</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "init" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
              <Bot className="w-5 h-5 text-health-blue" />
              <span>Hi! 👋 I'm your Health Assistant. How can I help you today? Choose an option below:</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep("bmi")}>BMI & Nutrition</Button>
              <Button variant="outline" onClick={() => setStep("symptom")}>Symptom Checker</Button>
            </div>
          </div>
        )}
        {step === "bmi" && (
          <form className="space-y-4" onSubmit={handleBmiSubmit}>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Age (years)"
                value={age}
                onChange={e => setAge(e.target.value)}
                required
                min={1}
                max={100}
                className="w-1/3"
              />
              <Input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                required
                min={10}
                max={200}
                className="w-1/3"
              />
              <Input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={e => setHeight(e.target.value)}
                required
                min={50}
                max={250}
                className="w-1/3"
              />
            </div>
            <Button type="submit" variant="accent">Get Suggestions</Button>
            <Button type="button" variant="ghost" onClick={reset}>Back</Button>
          </form>
        )}
        {step === "symptom" && (
          <form className="space-y-4" onSubmit={handleSymptomSubmit}>
            <Input
              type="text"
              placeholder="Enter your main symptom (e.g. fever, headache, cold, cough, stomachache)"
              value={symptom}
              onChange={e => setSymptom(e.target.value)}
              required
            />
            <Button type="submit" variant="accent">Get Suggestions</Button>
            <Button type="button" variant="ghost" onClick={reset}>Back</Button>
          </form>
        )}
        {step === "result" && (
          <div className="space-y-4">
            {bmiResult && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {bmiResult.status === "Normal" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-semibold">BMI: {bmiResult.bmi} ({bmiResult.status})</span>
                </div>
                {bmiResult.status === "Normal" ? (
                  <div className="text-green-700">You are in correct weight!</div>
                ) : (
                  <div>
                    <div className="mb-2 font-semibold">Diet Suggestions:</div>
                    <ul className="list-disc ml-6 mb-2">
                      {suggestions[bmiResult.status as keyof typeof suggestions]?.diet.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <div className="mb-2 font-semibold">Exercise Suggestions:</div>
                    <ul className="list-disc ml-6">
                      {suggestions[bmiResult.status as keyof typeof suggestions]?.exercise.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {symptomResult && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Symptom: {symptom}</span>
                </div>
                <div className="mb-2">{symptomResult.advice}</div>
                <div className="font-semibold mb-1">Suggested Tablets:</div>
                <ul className="list-disc ml-6">
                  {symptomResult.tablets.map((tab: string, i: number) => (
                    <li key={i}>{tab}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button variant="outline" onClick={reset}>Try Again</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
