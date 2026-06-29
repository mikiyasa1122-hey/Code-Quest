export type PublicChoice = {
  id: string;
  text: string;
  order: number;
};

export type PublicQuest = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  explanation: string;
  type: "MULTIPLE_CHOICE" | "TEXT_INPUT" | "CODE_INPUT";
  difficulty: "BEGINNER" | "NORMAL" | "HARD" | "BOSS";
  xpReward: number;
  starterCode: string | null;
  choices: PublicChoice[];
  category: {
    id: string;
    name: string;
    slug: string;
    accentColor: string;
  };
};
