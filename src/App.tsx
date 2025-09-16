import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, RotateCcw, Info, Search, Shield, Hammer } from "lucide-react";

/** ──────────────────────────────────────────────────────────────────────────
 *  Team & quiz data (beginner-friendly)
 *  ────────────────────────────────────────────────────────────────────────── */

const TEAM_ORDER = ["blue","red","purple","yellow","green","orange","white","black"] as const;
type TeamKey = typeof TEAM_ORDER[number];

type TeamInfo = {
  name: string;
  tagline: string;
  summary: string;
  roles: string[];
  core: string[];
};

const TEAMS: Record<TeamKey, TeamInfo> = {
  blue: {
    name: "Blue Team",
    tagline: "Defenders who protect systems.",
    summary:
      "Blue Teams focus on defending organizations. They monitor systems, look for unusual activity, stop hackers, and fix weaknesses. A beginner might start as a SOC analyst watching alerts and learning how to respond to incidents.",
    roles: ["SOC Analyst (entry-level alert monitoring)", "Incident Responder", "Threat Hunter", "Detection Engineer"],
    core: ["Watch alerts for suspicious activity", "Investigate and respond when something looks wrong", "Patch and secure systems", "Learn attacker methods and build defenses"]
  },
  red: {
    name: "Red Team",
    tagline: "Hackers who test defenses.",
    summary:
      "Red Teams try to break into systems the way attackers do. This teaches organizations where they’re weak. Beginners might learn how to scan networks, test websites, and try common attacks in a safe environment.",
    roles: ["Penetration Tester", "Red Team Operator", "Exploit Developer"],
    core: ["Look for weaknesses in websites and networks", "Try to get into systems like a hacker would", "Write clear reports on how to fix problems"]
  },
  purple: {
    name: "Purple Team",
    tagline: "Helpers who connect Red and Blue.",
    summary:
      "Purple Teams bring defenders and attackers together. They run small tests, then show defenders how to block attacks. Beginners can practice both defense and offense in this space.",
    roles: ["Purple Team Facilitator", "Attack Simulation Specialist"],
    core: ["Plan small attack/defense exercises", "Help defenders learn from attacks", "Test if defenses actually work"]
  },
  yellow: {
    name: "Yellow Team",
    tagline: "Builders who write secure code.",
    summary:
      "Yellow Teams are the developers and engineers. They build apps and systems safely from the start. Beginners may focus on learning secure coding basics and reviewing code for mistakes.",
    roles: ["Software Developer", "Security-Aware Engineer"],
    core: ["Write code with security in mind", "Fix insecure code", "Understand how to design safe features"]
  },
  green: {
    name: "Green Team",
    tagline: "Builders and defenders together.",
    summary:
      "Green Teams mix development with defense. They make sure apps are secure while running, using automation and DevOps. Beginners might learn about CI/CD pipelines and adding security checks.",
    roles: ["DevSecOps Engineer", "AppSec Engineer"],
    core: ["Add security checks into app pipelines", "Make apps log important security events", "Work with developers and defenders at once"]
  },
  orange: {
    name: "Orange Team",
    tagline: "Designers who make security easy.",
    summary:
      "Orange Teams connect Red Teams (hackers) with developers. They help builders understand attacks and design safer systems. Beginners may help write guides or do basic threat modeling.",
    roles: ["Product Security Engineer", "Developer Educator"],
    core: ["Show developers how attackers think", "Create guides for secure building", "Review new designs for weak points"]
  },
  white: {
    name: "White Team",
    tagline: "Rule-makers and coordinators.",
    summary:
      "White Teams set the rules for exercises, policies, and compliance. They make sure security programs run smoothly and fairly. Beginners may learn about policies, documentation, and awareness training.",
    roles: ["Risk & Compliance Analyst", "Security Program Coordinator"],
    core: ["Write and explain security policies", "Check if rules are being followed", "Run security training programs"]
  },
  black: {
    name: "Black Team",
    tagline: "Infrastructure builders.",
    summary:
      "Black Teams set up the systems that Red, Blue, and Purple Teams use. They build labs, networks, and tools for training and real-world defense. Beginners may work on setting up safe test networks.",
    roles: ["Security Infrastructure Engineer", "Lab Builder"],
    core: ["Build and maintain training labs", "Set up security tools and systems", "Make sure environments are reliable and safe"]
  }
};

type Choice = { label: string; weights: Partial<Record<TeamKey, number>> };
type Question = { id: string; text: string; choices: Choice[] };

/** 15 beginner-friendly questions */
const QUESTIONS: Question[] = [
  { id: "interest", text: "Which sounds most interesting to you?", choices: [
    { label: "Catching hackers trying to get in", weights: { blue: 3 } },
    { label: "Pretending to be the hacker", weights: { red: 3 } },
    { label: "Building apps and making them secure", weights: { yellow: 3 } },
    { label: "Writing rules and making sure people follow them", weights: { white: 3 } }
  ]},
  { id: "skills", text: "What skill would you enjoy learning first?", choices: [
    { label: "Reading system logs", weights: { blue: 3 } },
    { label: "Using hacking tools", weights: { red: 3 } },
    { label: "Learning to code", weights: { yellow: 3 } },
    { label: "Writing reports", weights: { white: 3 } }
  ]},
  { id: "teamwork", text: "How do you like to work?", choices: [
    { label: "Watching and responding quickly as a team", weights: { blue: 3 } },
    { label: "Working like an attacker then explaining later", weights: { red: 3 } },
    { label: "Collaborating with both defenders and hackers", weights: { purple: 3 } },
    { label: "Writing clear rules for everyone to follow", weights: { white: 3 } }
  ]},
  { id: "building", text: "Do you prefer fixing or building?", choices: [
    { label: "Fixing problems", weights: { blue: 3 } },
    { label: "Breaking things to test them", weights: { red: 3 } },
    { label: "Building new features", weights: { yellow: 3 } },
    { label: "Making sure everything runs smoothly", weights: { black: 3 } }
  ]},
  { id: "attackdefend", text: "Would you rather stop attacks or make them?", choices: [
    { label: "Stop attacks", weights: { blue: 3 } },
    { label: "Make attacks (safely)", weights: { red: 3 } }
  ]},
  { id: "design", text: "Do you like design and user experience?", choices: [
    { label: "Yes, I want to design safer apps", weights: { orange: 3 } },
    { label: "Not really, I like technical details more", weights: { blue: 2, red: 2 } }
  ]},
  { id: "policy", text: "Would you enjoy writing rules and training others?", choices: [
    { label: "Yes, I like teaching and rules", weights: { white: 3 } },
    { label: "No, I’d rather do hands-on work", weights: { blue: 2, red: 2 } }
  ]},
  { id: "tools", text: "Which tool sounds coolest?", choices: [
    { label: "Security camera for networks (SIEM)", weights: { blue: 3 } },
    { label: "Lockpick for computers (hacking tool)", weights: { red: 3 } },
    { label: "Code scanner that finds mistakes", weights: { yellow: 3 } },
    { label: "Training lab you can build", weights: { black: 3 } }
  ]},
  { id: "pressure", text: "What do you do under pressure?", choices: [
    { label: "Calmly solve problems", weights: { blue: 3 } },
    { label: "Get creative to reach goals", weights: { red: 3 } },
    { label: "Step back and improve the design", weights: { orange: 3 } },
    { label: "Organize people and rules", weights: { white: 3 } }
  ]},
  { id: "future", text: "Which future job sounds fun?", choices: [
    { label: "Incident responder", weights: { blue: 3 } },
    { label: "Penetration tester", weights: { red: 3 } },
    { label: "Software engineer with security skills", weights: { yellow: 3 } },
    { label: "Compliance officer", weights: { white: 3 } }
  ]},
  { id: "infra", text: "Do you like working with servers and networks?", choices: [
    { label: "Yes, I like building systems", weights: { black: 3 } },
    { label: "No, I like working with apps or people", weights: { orange: 2, white: 2 } }
  ]},
  { id: "learning", text: "How do you like to learn?", choices: [
    { label: "By doing hands-on labs", weights: { red: 2, blue: 2 } },
    { label: "By reading guides and rules", weights: { white: 3 } },
    { label: "By building projects", weights: { yellow: 3 } }
  ]},
  { id: "collab", text: "Would you enjoy being the bridge between hackers and defenders?", choices: [
    { label: "Yes", weights: { purple: 3 } },
    { label: "No", weights: { blue: 2, red: 2 } }
  ]},
  { id: "automation", text: "Do you like automation and DevOps?", choices: [
    { label: "Yes, I want to automate security", weights: { green: 3 } },
    { label: "No, I’d rather do direct defense or attacks", weights: { blue: 2, red: 2 } }
  ]},
  { id: "teamrole", text: "Which role feels most like you?", choices: [
    { label: "Defender of systems", weights: { blue: 3 } },
    { label: "Attacker (ethical hacker)", weights: { red: 3 } },
    { label: "Builder of secure code", weights: { yellow: 3 } },
    { label: "Rule-maker and organizer", weights: { white: 3 } }
  ]}
];

/** ──────────────────────────────────────────────────────────────────────────
 *  Scoring helpers
 *  ────────────────────────────────────────────────────────────────────────── */

type Answer = { qid: string; choiceIdx: number };

function scoreAnswers(answers: Answer[]) {
  const tally: Record<TeamKey, number> = TEAM_ORDER.reduce(
    (acc, k) => ({ ...acc, [k]: 0 }),
    {} as Record<TeamKey, number>
  );
  answers.forEach(a => {
    const q = QUESTIONS.find(q => q.id === a.qid)!;
    const choice = q.choices[a.choiceIdx];
    Object.entries(choice.weights).forEach(([k, v]) => {
      tally[k as TeamKey] += v || 0;
    });
  });
  return tally;
}

function pickTop(tally: Record<TeamKey, number>) {
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]) as [TeamKey, number][];
  const [best, second] = sorted;
  return { bestKey: best[0], bestScore: best[1], runnerUpKey: second?.[0], sorted };
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1, max)) * 100)));
  return (
    <div className="w-full h-3 bg-gray-200/70 rounded-xl overflow-hidden">
      <div className="h-full rounded-xl bg-black" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** ──────────────────────────────────────────────────────────────────────────
 *  App
 *  ────────────────────────────────────────────────────────────────────────── */

export default function App() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [step, setStep] = useState(0);
  const [showExplore, setShowExplore] = useState(false);

  const tally = useMemo(() => scoreAnswers(answers), [answers]);
  const { bestKey, sorted, runnerUpKey } = useMemo(() => pickTop(tally), [tally]);

  const currentQ = QUESTIONS[step];
  const complete = step >= QUESTIONS.length;

  const totalPossible = useMemo(() => {
    const maxPerTeam = TEAM_ORDER.reduce((acc, k) => {
      let sum = 0;
      QUESTIONS.forEach(q => {
        const max = Math.max(...q.choices.map(c => c.weights[k] || 0));
        sum += max;
      });
      acc[k] = sum;
      return acc;
    }, {} as Record<TeamKey, number>);
    return maxPerTeam;
  }, []);

  function choose(idx: number) {
    const existingIdx = answers.findIndex(a => a.qid === currentQ.id);
    const next = [...answers];
    if (existingIdx >= 0) next[existingIdx] = { qid: currentQ.id, choiceIdx: idx };
    else next.push({ qid: currentQ.id, choiceIdx: idx });
    setAnswers(next);
  }

  function nextStep() {
    setStep(s => Math.min(s + 1, QUESTIONS.length));
  }
  function prevStep() {
    setStep(s => Math.max(0, s - 1));
  }
  function reset() {
    setAnswers([]);
    setStep(0);
    setShowExplore(false);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">CyberSec Team Fit</h1>
            <p className="text-slate-700 mt-1">
              Answer 15 beginner-friendly questions to discover which cybersecurity team matches your interests and working style. No prior experience needed. Explore all teams afterward.
            </p>
          </div>
          <Button variant="secondary" onClick={reset} className="rounded-2xl">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </header>

        {/* Quiz */}
        {!complete && currentQ && (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Search className="h-4 w-4" />
                <span>Question {step + 1} of {QUESTIONS.length}</span>
              </div>
              <h2 className="text-xl font-semibold">{currentQ.text}</h2>
              <div className="grid gap-3">
                {currentQ.choices.map((c, idx) => {
                  const selected = answers.find(a => a.qid === currentQ.id)?.choiceIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => choose(idx)}
                      className={`text-left p-4 rounded-2xl border transition hover:shadow-sm ${selected ? "border-black ring-1 ring-black" : "border-slate-300"}`}
                    >
                      <div className="flex items-start gap-2">
                        {selected ? <Check className="mt-1 h-4 w-4" /> : <span className="mt-1 inline-block h-4 w-4 rounded-full border border-slate-400" />}
                        <span>{c.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={prevStep} disabled={step === 0} className="rounded-2xl">
                  Back
                </Button>
                <Button onClick={nextStep} className="rounded-2xl">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {complete && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Shield className="h-4 w-4" />
                    <span>Your best fit</span>
                  </div>
                  <h2 className="text-2xl font-bold">{TEAMS[bestKey].name}</h2>
                  <p className="text-slate-700">{TEAMS[bestKey].summary}</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <h3 className="font-semibold mb-2">Typical roles</h3>
                      <ul className="list-disc pl-5 space-y-1 text-slate-800">
                        {TEAMS[bestKey].roles.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Core responsibilities</h3>
                      <ul className="list-disc pl-5 space-y-1 text-slate-800">
                        {TEAMS[bestKey].core.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Info className="h-4 w-4" />
                    <span>How your answers scored</span>
                  </div>
                  <div className="space-y-3">
                    {sorted.map(([k, v]) => (
                      <div key={k} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{TEAMS[k as TeamKey].name}</span>
                          <span>{v} / {totalPossible[k as TeamKey]}</span>
                        </div>
                        <ProgressBar value={v} max={totalPossible[k as TeamKey]} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button className="rounded-2xl" onClick={() => setShowExplore(true)}>
                  <Hammer className="mr-2 h-4 w-4" />
                  Explore all teams
                </Button>
                {runnerUpKey && (
                  <Button
                    variant="secondary"
                    className="rounded-2xl"
                    onClick={() => {
                      setShowExplore(true);
                      const el = document.getElementById(runnerUpKey);
                      setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                    }}
                  >
                    See your runner-up
                  </Button>
                )}
              </div>
            </div>

            <aside className="space-y-3">
              <Card className="rounded-2xl">
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold">What working this role feels like</h3>
                  <ul className="list-disc pl-5 text-slate-800 space-y-1">
                    <li>
                      <b>Cadence:</b>{" "}
                      {bestKey === "red"
                        ? "project bursts & campaigns"
                        : bestKey === "blue"
                        ? "steady monitoring with occasional incidents"
                        : bestKey === "purple"
                        ? "time-boxed exercises and workshops"
                        : bestKey === "yellow"
                        ? "sprints and code reviews"
                        : bestKey === "green"
                        ? "pipelines, releases, and platform ops"
                        : bestKey === "orange"
                        ? "design reviews and developer training"
                        : bestKey === "white"
                        ? "policy cycles, audits, and coordination"
                        : "platform reliability, lab builds, and enabling others"}
                      .
                    </li>
                    <li><b>Tools:</b> See typical stacks listed under each team; expect hands-on usage daily.</li>
                    <li><b>Growth path:</b> Junior → practitioner → lead/architect/manager. Cross-team moves are common (e.g., Red → Purple → Blue detection engineer).</li>
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}

        {/* Explore all teams */}
        {complete && showExplore && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Explore every team</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {TEAM_ORDER.map(k => (
                <Card id={k} key={k} className={`rounded-2xl ${k === bestKey ? "ring-2 ring-black" : ""}`}>
                  <CardContent className="p-6 space-y-2">
                    <h3 className="text-lg font-bold">{TEAMS[k].name}</h3>
                    <p className="text-slate-700">{TEAMS[k].tagline}</p>
                    <p className="text-slate-800">{TEAMS[k].summary}</p>
                    <div className="grid sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <h4 className="font-semibold mb-1">Typical roles</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {TEAMS[k].roles.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Core responsibilities</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {TEAMS[k].core.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <footer className="text-xs text-slate-600 pt-6">
          <p>Tip: This quiz provides guidance, not gatekeeping. You can thrive in multiple areas—use results to plan skills, labs, and projects.</p>
        </footer>
      </div>
    </div>
  );
}
