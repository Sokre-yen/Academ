export type AppLanguage = 'en' | 'km';

export const translations = {
  en: {
    common: {
      appTitle: "Academ",
      loading: "Loading...",
      error: "An error occurred",
      back: "Back",
      next: "Next",
      previous: "Previous",
      save: "Save",
      cancel: "Cancel",
      score: "Score"
    },
    sidebar: {
      dashboard: "Dashboard",
      chat: "Tutor Chat",
      vocab: "Vocabulary",
      grammar: "Grammar Guide",
      game: "Word Games",
      settings: "Settings",
      signOut: "Sign Out",
      aiCompanion: "AI Language Companion",
      languageToggle: "Language"
    },
    auth: {
      loginTitle: "Log in to continue learning",
      signUpTitle: "Join Academ",
      signUpSubtitle: "Start your language journey today",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      signInBtn: "Sign In",
      signingIn: "Signing in...",
      googleBtn: "Continue with Google",
      createAccountBtn: "Create Account",
      creatingAccount: "Creating account...",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      loginLink: "Log in",
      signUpLink: "Sign up",
      duplicateEmail: "An account with this email already exists.",
      invalidCreds: "Invalid email or password.",
      authFailed: "Authentication failed. Please try again."
    },
    dashboard: {
      welcome: "Welcome back",
      learning: "Learning",
      streak: "Current Streak",
      days: "Days",
      stats: {
        xp: "Total XP",
        words: "Words Learned",
        goal: "Daily Goal"
      },
      weeklyActivity: "Weekly Activity (Hours)",
      continueChat: "Continue Conversation",
      chatPrompt: "Resume your last chat with your AI tutor.",
      chatNow: "Chat Now",
      recommended: "Recommended Lessons",
      playGame: "Play Word Master",
      gameDesc: "Master vocabulary through interactive fill-in-the-blank challenges."
    },
    tools: {
      game: {
        title: "Word Master",
        subtitle: "Fill in the blanks to complete the sentences.",
        startBtn: "Start Playing",
        loading: "Generating challenges...",
        nextQuestion: "Next Question",
        finishGame: "View Results",
        correct: "Correct!",
        incorrect: "Not quite!",
        explanation: "Why?",
        gameOver: "Game Over!",
        scoreResult: "You scored {score} out of {total}",
        playAgain: "Play Again",
        quit: "Quit"
      },
      chat: {
        header: "AI Tutor",
        placeholder: "Type a message in {lang}...",
        thinking: "Thinking..."
      },
      vocab: {
        title: "Vocabulary Builder",
        subtitle: "Generate 10 flashcards on any topic.",
        topicLabel: "Topic",
        topicPlaceholder: "e.g., At the Airport, Cooking...",
        generateBtn: "Create Deck",
        generating: "Generating 10 cards...",
        clickToFlip: "Click to flip",
        translation: "Translation",
        example: "Example",
        emptyState: "Enter a topic above to generate cards.",
        listen: "Listen"
      },
      grammar: {
        title: "Grammar Guide",
        subtitle: "Ask about any grammar rule in {lang}.",
        searchPlaceholder: "e.g., How do I use the subjunctive?",
        explainBtn: "Explain",
        searching: "Searching...",
        popularTopics: "Popular Topics",
        emptyState: "Search for a concept to get a detailed AI explanation."
      },
      settings: {
        title: "Settings",
        targetLang: "Target Language (What you want to learn)",
        nativeLang: "Native Language (Your first language)",
        proficiency: "Proficiency Level"
      }
    }
  },
  km: {
    common: {
      appTitle: "Academ",
      loading: "កំពុងផ្ទុក...",
      error: "មានកំហុសបានកើតឡើង",
      back: "ត្រឡប់ក្រោយ",
      next: "បន្ទាប់",
      previous: "មុន",
      save: "រក្សាទុក",
      cancel: "បោះបង់",
      score: "ពិន្ទុ"
    },
    sidebar: {
      dashboard: "ផ្ទាំងគ្រប់គ្រង",
      chat: "ការជជែកជាមួយគ្រូ",
      vocab: "ការរៀនពាក្យ",
      grammar: "មគ្គុទ្ទេសក៍វេយ្យាករណ៍",
      game: "ហ្គេមរៀនពាក្យ",
      settings: "ការកំណត់",
      signOut: "ចាកចេញ",
      aiCompanion: "ដៃគូរៀនភាសា AI",
      languageToggle: "ភាសាកម្មវិធី"
    },
    auth: {
      loginTitle: "ចូលដើម្បីបន្តការសិក្សា",
      signUpTitle: "ចូលរួមជាមួយ Academ",
      signUpSubtitle: "ចាប់ផ្តើមដំណើររៀនភាសារបស់អ្នកនៅថ្ងៃនេះ",
      email: "អ៊ីមែល",
      password: "លេខសម្ងាត់",
      fullName: "ឈ្មោះពេញ",
      signInBtn: "ចូល",
      signingIn: "កំពុងចូល...",
      googleBtn: "បន្តជាមួយ Google",
      createAccountBtn: "បង្កើតគណនី",
      creatingAccount: "កំពុងបង្កើតគណនី...",
      noAccount: "មិនទាន់មានគណនីមែនទេ?",
      hasAccount: "មានគណនីរួចហើយមែនទេ?",
      loginLink: "ចូល",
      signUpLink: "ចុះឈ្មោះ",
      duplicateEmail: "គណនីដែលមានអ៊ីមែលនេះមានរួចហើយ។",
      invalidCreds: "អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវ។",
      authFailed: "ការផ្ទៀងផ្ទាត់បានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។"
    },
    dashboard: {
      welcome: "សូមស្វាគមន៍មកវិញ",
      learning: "កំពុងរៀន",
      streak: "ការរៀនជាប់ៗគ្នា",
      days: "ថ្ងៃ",
      stats: {
        xp: "ពិន្ទុសរុប",
        words: "ពាក្យដែលបានរៀន",
        goal: "គោលដៅប្រចាំថ្ងៃ"
      },
      weeklyActivity: "សកម្មភាពប្រចាំសប្តាហ៍ (ម៉ោង)",
      continueChat: "បន្តការសន្ទនា",
      chatPrompt: "បន្តការជជែកចុងក្រោយរបស់អ្នកជាមួយគ្រូ AI។",
      chatNow: "ជជែកឥឡូវនេះ",
      recommended: "មេរៀនដែលបានណែនាំ",
      playGame: "លេង Word Master",
      gameDesc: "ស្ទាត់ជំនាញពាក្យពេចន៍តាមរយៈការបំពេញចន្លោះដែលមានអន្តរកម្ម។"
    },
    tools: {
      game: {
        title: "Word Master",
        subtitle: "បំពេញចន្លោះដើម្បីបញ្ចប់ប្រយោគ។",
        startBtn: "ចាប់ផ្តើមលេង",
        loading: "កំពុងបង្កើតការប្រកួត...",
        nextQuestion: "សំណួរបន្ទាប់",
        finishGame: "មើលលទ្ធផល",
        correct: "ត្រឹមត្រូវ!",
        incorrect: "មិនទាន់ត្រឹមត្រូវទេ!",
        explanation: "ហេតុអ្វី?",
        gameOver: "ហ្គេមបានបញ្ចប់!",
        scoreResult: "អ្នកទទួលបានពិន្ទុ {score} ក្នុងចំណោម {total}",
        playAgain: "លេងម្តងទៀត",
        quit: "ឈប់"
      },
      chat: {
        header: "គ្រូ AI",
        placeholder: "វាយសារជាភាសា {lang}...",
        thinking: "កំពុងគិត..."
      },
      vocab: {
        title: "កម្មវិធីបង្កើនការរៀនពាក្យ",
        subtitle: "បង្កើតកាតសិក្សាចំនួន ១០ លើប្រធានបទណាមួយ។",
        topicLabel: "ប្រធានបទ",
        topicPlaceholder: "ឧទាហរណ៍៖ នៅព្រលានយន្តហោះ, ការធ្វើម្ហូប...",
        generateBtn: "បង្កើតកាត",
        generating: "កំពុងបង្កើតកាត ១០...",
        clickToFlip: "ចុចដើម្បីមើលការបកប្រែ",
        translation: "ការបកប្រែ",
        example: "ឧទាហរណ៍",
        emptyState: "បញ្ចូលប្រធានបទខាងលើដើម្បីបង្កើតកាតសិក្សា។",
        listen: "ស្តាប់"
      },
      grammar: {
        title: "មគ្គុទ្ទេសក៍វេយ្យាករណ៍",
        subtitle: "សួរអំពីច្បាប់វេយ្យាករណ៍ណាមួយក្នុងភាសា {lang}។",
        searchPlaceholder: "ឧទាហរណ៍៖ តើខ្ញុំប្រើ subjunctive យ៉ាងដូចម្តេច?",
        explainBtn: "ពន្យល់",
        searching: "កំពុងស្វែងរក...",
        popularTopics: "ប្រធានបទពេញនិយម",
        emptyState: "ស្វែងរកគោលការណ៍ណាមួយដើម្បីទទួលបានការពន្យល់លម្អិតពី AI។"
      },
      settings: {
        title: "ការកំណត់",
        targetLang: "ភាសាចង់រៀន",
        nativeLang: "ភាសាកំណើត",
        proficiency: "កម្រិតសមត្ថភាព"
      }
    }
  }
};