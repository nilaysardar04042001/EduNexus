import 'dotenv/config'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim()
const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim()
const useTurso = Boolean(tursoUrl && tursoToken)
const prisma = useTurso
  ? new PrismaClient({
      adapter: new PrismaLibSQL({
        url: tursoUrl!,
        authToken: tursoToken,
      }),
    })
  : new PrismaClient()

interface SeedCourseInput {
  slug: string
  order: string
  sortOrder: number
  shortLabel: string
  title: string
  category: string
  level: string
  summary: string
  duration: string
  modulesLabel: string
  credential: string
  imageKey: string
  imageAlt: string
  pillar: 'learn' | 'practice' | 'create' | 'excel'
  iconKey: 'computer' | 'web' | 'python' | 'database'
  isFeaturedHero: boolean
  outcomes: string[]
  tools: { label: string; logoKey: string }[]
  modules: {
    title: string
    description: string
    outcome: string
    lessons: { slug: string; title: string; summary: string; durationMins: number }[]
  }[]
  questions: {
    difficulty: 'easy' | 'medium' | 'hard'
    prompt: string
    options: string[]
    answerIndex: number
    explanation: string
    xpReward: number
  }[]
}

const SEED_COURSES: SeedCourseInput[] = [
  {
    slug: 'fundamentals-of-computer',
    order: '01',
    sortOrder: 1,
    shortLabel: 'Computer Fundamentals',
    title: 'Fundamentals of Computer',
    category: 'Core Computing',
    level: 'Beginner',
    summary:
      'Build rock-solid digital fluency from the ground up — understand how hardware and operating systems work, master office productivity tools, and navigate the internet safely.',
    duration: '35 Hours',
    modulesLabel: '6 Modules',
    credential: 'Foundations Certificate',
    imageKey: 'fundamentals-of-computer',
    imageAlt:
      'Illustration of a modern computer monitor showing CPU processor architecture, memory modules, operating system folders, office spreadsheets, and a cyber safety shield',
    pillar: 'learn',
    iconKey: 'computer',
    isFeaturedHero: true,
    outcomes: [
      'Identify core computer hardware (CPU, RAM, storage, I/O) & system architecture',
      'Operate Windows/Linux desktops and organize files, folders, and settings cleanly',
      'Create formatted documents, formula-driven spreadsheets, and clean slide decks',
      'Browse securely, manage email workflows, and troubleshoot common PC issues',
    ],
    tools: [
      { label: 'CPU & Hardware', logoKey: 'cpu' },
      { label: 'Operating Systems', logoKey: 'os' },
      { label: 'Docs & Sheets', logoKey: 'office' },
      { label: 'Cyber Safety', logoKey: 'shield' },
    ],
    modules: [
      {
        title: 'Introduction to Computers & Hardware Basics',
        description: 'Generations of computers, CPU (ALU & Control Unit), RAM/ROM, storage, and I/O peripherals.',
        outcome: 'Distinguish physical computer components and explain how data flows through a machine.',
        lessons: [
          {
            slug: 'what-is-a-computer',
            title: 'What Is a Computer & Evolution Overview',
            summary: 'Explore generations of computers and device categories from desktops to smartphones.',
            durationMins: 20,
          },
          {
            slug: 'cpu-memory-storage',
            title: 'Inside the Machine: CPU, RAM, ROM & Storage',
            summary: 'Understand how the ALU, Control Unit, primary memory, and SSD/HDD work together.',
            durationMins: 30,
          },
          {
            slug: 'input-output-peripherals',
            title: 'Input & Output Peripherals',
            summary: 'Identify keyboards, pointers, scanners, displays, printers, and modern USB-C/HDMI ports.',
            durationMins: 20,
          },
        ],
      },
      {
        title: 'Software & Operating System Fundamentals',
        description: 'System vs. application software, desktop navigation, file management, and settings.',
        outcome: 'Navigate an OS interface confidently and organize digital files systematically.',
        lessons: [
          {
            slug: 'system-vs-application-software',
            title: 'System Software vs. Application Software',
            summary: 'Compare OS kernels, device drivers, utilities, and everyday user apps.',
            durationMins: 20,
          },
          {
            slug: 'desktop-and-file-management',
            title: 'Desktop Navigation & File/Folder Organization',
            summary: 'Master paths, extensions, copying, moving, shortcuts, and recycle-bin recovery.',
            durationMins: 30,
          },
          {
            slug: 'system-settings-basics',
            title: 'Essential System Settings & Basic Troubleshooting',
            summary: 'Configure display, audio, networks, updates, and resolve common peripheral issues.',
            durationMins: 25,
          },
        ],
      },
      {
        title: 'Digital Literacy, Internet & Cyber Safety',
        description: 'Web browsers, URLs, search techniques, professional email, and cyber hygiene.',
        outcome: 'Search the web effectively, communicate via email, and defend against common scams.',
        lessons: [
          {
            slug: 'internet-browsers-search',
            title: 'How the Web Works: URLs, Browsers & Smart Search',
            summary: 'Understand HTTPS, IP addresses, bookmarks, tabs, and high-precision search queries.',
            durationMins: 25,
          },
          {
            slug: 'email-communication',
            title: 'Professional Email Setup & Etiquette',
            summary: 'Compose clear emails, use CC/BCC properly, attach files safely, and organize folders.',
            durationMins: 20,
          },
          {
            slug: 'cyber-safety-hygiene',
            title: 'Passwords, Phishing Detection & Safe Browsing',
            summary: 'Spot social-engineering traps, build strong passphrases, and enable 2FA.',
            durationMins: 25,
          },
        ],
      },
      {
        title: 'Word Processing & Document Design',
        description: 'Creating, styling, formatting, and exporting professional documents (DOCX & PDF).',
        outcome: 'Design clean reports, letters, and resumes with tables, headings, and imagery.',
        lessons: [
          {
            slug: 'document-formatting',
            title: 'Typography, Paragraphs, Lists & Styles',
            summary: 'Use consistent heading hierarchy, spacing, bullets, and alignment.',
            durationMins: 25,
          },
          {
            slug: 'tables-media-export',
            title: 'Tables, Images, Headers & PDF Export',
            summary: 'Insert visual elements cleanly and publish print-ready PDF documents.',
            durationMins: 30,
          },
        ],
      },
      {
        title: 'Spreadsheets & Data Basics',
        description: 'Workbooks, cells, formatting, essential formulas, sorting, filtering, and charts.',
        outcome: 'Automate basic calculations with formulas and turn raw numbers into charts.',
        lessons: [
          {
            slug: 'cells-and-formulas',
            title: 'Cells, Data Types & Core Formulas (SUM, AVERAGE, COUNT)',
            summary: 'Build structured tables and compute totals, averages, mins, and maxes automatically.',
            durationMins: 35,
          },
          {
            slug: 'sorting-filtering-charts',
            title: 'Sorting, Filtering & Visual Charts',
            summary: 'Clean datasets and generate crisp bar, line, and pie charts.',
            durationMins: 30,
          },
        ],
      },
      {
        title: 'Presentation Graphics & Delivery',
        description: 'Slide structure, visual hierarchy, themes, multimedia, and clean presentation flow.',
        outcome: 'Build engaging, clutter-free presentations for classes and workplace briefings.',
        lessons: [
          {
            slug: 'slide-design-principles',
            title: 'Slide Layouts, Themes & Visual Clarity',
            summary: 'Apply clean grids, readable contrast, and minimal text per slide.',
            durationMins: 25,
          },
          {
            slug: 'transitions-and-delivery',
            title: 'Subtle Transitions, Speaker Notes & Live Delivery',
            summary: 'Rehearse timing, use presenter view, and export shareable decks.',
            durationMins: 20,
          },
        ],
      },
    ],
    questions: [
      {
        difficulty: 'easy',
        prompt: 'Which component acts as volatile primary memory that loses data when power is turned off?',
        options: ['SSD (Solid State Drive)', 'RAM (Random Access Memory)', 'ROM (Read-Only Memory)', 'USB Flash Drive'],
        answerIndex: 1,
        explanation: 'RAM is volatile primary memory used by active programs and clears when the computer powers down.',
        xpReward: 25,
      },
      {
        difficulty: 'easy',
        prompt: 'In spreadsheets, which formula calculates the arithmetic mean of cells A1 through A10?',
        options: ['=SUM(A1:A10)', '=COUNT(A1:A10)', '=AVERAGE(A1:A10)', '=MEAN_ALL(A1:A10)'],
        answerIndex: 2,
        explanation: '=AVERAGE(A1:A10) computes the arithmetic average across the cell range A1 to A10.',
        xpReward: 25,
      },
    ],
  },
  {
    slug: 'web-development-essentials',
    order: '02',
    sortOrder: 2,
    shortLabel: 'Web Development',
    title: 'Web Development Essentials',
    category: 'Frontend Track',
    level: 'Beginner → Intermediate',
    summary:
      'Design and ship responsive, accessible modern websites using semantic HTML5, CSS Grid & Flexbox, modern JavaScript, and component-driven React.',
    duration: '48 Hours',
    modulesLabel: '8 Modules',
    credential: '5 Live Projects',
    imageKey: 'web-development',
    imageAlt:
      'Illustration of a responsive desktop web browser and mobile viewport showing syntax-highlighted code, modular UI cards, and a React atom emblem',
    pillar: 'create',
    iconKey: 'web',
    isFeaturedHero: true,
    outcomes: [
      'Craft semantic, WCAG-accessible HTML5 pages and responsive CSS layouts',
      'Build interactive browser apps with modern JavaScript, DOM, and Fetch APIs',
      'Structure reusable React & TypeScript components with clean state flow',
      'Audit Core Web Vitals and deploy production-ready portfolio websites',
    ],
    tools: [
      { label: 'HTML5', logoKey: 'html5' },
      { label: 'CSS3 Grid', logoKey: 'css3' },
      { label: 'React UI', logoKey: 'react' },
      { label: 'Dev Tools', logoKey: 'terminal' },
    ],
    modules: [
      {
        title: 'Semantic HTML5 & Accessibility Foundations',
        description: 'Document landmarks, forms, ARIA fundamentals, and keyboard navigation.',
        outcome: 'Author clean, accessible HTML documents that work seamlessly for all users.',
        lessons: [
          {
            slug: 'semantic-landmarks',
            title: 'Landmarks, Headings & Document Structure',
            summary: 'Use header, nav, main, section, article, and footer properly.',
            durationMins: 25,
          },
        ],
      },
      {
        title: 'Modern CSS Layouts & Responsive Design',
        description: 'Flexbox, CSS Grid, fluid typography, dark mode, and GPU animations.',
        outcome: 'Build responsive multi-screen layouts with zero horizontal overflow.',
        lessons: [
          {
            slug: 'flexbox-and-grid',
            title: 'Mastering Flexbox & CSS Grid',
            summary: 'Combine 1D Flexbox and 2D CSS Grid for clean, maintainable UIs.',
            durationMins: 35,
          },
        ],
      },
    ],
    questions: [
      {
        difficulty: 'easy',
        prompt: 'Which CSS property animates strictly on the GPU compositor without triggering layout or paint?',
        options: ['width', 'background-position', 'transform', 'margin-top'],
        answerIndex: 2,
        explanation: 'transform runs directly on the browser compositor thread with zero layout reflow or main-thread repaint.',
        xpReward: 25,
      },
    ],
  },
  {
    slug: 'python-problem-solving',
    order: '03',
    sortOrder: 3,
    shortLabel: 'Python & Logic',
    title: 'Python & Problem Solving',
    category: 'Programming Core',
    level: 'Beginner',
    summary:
      'Develop strong computational thinking through clean Python syntax, core data structures, recursion, and 150+ interactive coding drills.',
    duration: '40 Hours',
    modulesLabel: '7 Modules',
    credential: '150+ Coding Drills',
    imageKey: 'python-problem-solving',
    imageAlt:
      'Illustration of a Python coding workspace featuring a glowing binary tree graph, ascending sorting algorithm bars, Python emblem, and terminal prompt',
    pillar: 'practice',
    iconKey: 'python',
    isFeaturedHero: true,
    outcomes: [
      'Write clean, modular Python code using functions, collections, and OOP',
      'Solve structured problems using arrays, hash maps, stacks, queues & trees',
      'Automate file processing, JSON parsing, and everyday workflows with scripts',
      'Debug systematically and reason about runtime & memory efficiency',
    ],
    tools: [
      { label: 'Python 3', logoKey: 'python' },
      { label: 'Algorithms', logoKey: 'algo' },
      { label: 'CLI & Scripts', logoKey: 'terminal' },
      { label: 'Complexity', logoKey: 'analytics' },
    ],
    modules: [
      {
        title: 'Python Syntax, Control Flow & Functions',
        description: 'Variables, loops, conditionals, modular functions, and error handling.',
        outcome: 'Write readable, bug-free Python programs from scratch.',
        lessons: [
          {
            slug: 'python-core-building-blocks',
            title: 'Variables, Types, Loops & Functions',
            summary: 'Master Pythonic control flow, list comprehensions, and clean function design.',
            durationMins: 30,
          },
        ],
      },
    ],
    questions: [
      {
        difficulty: 'medium',
        prompt: 'What is the average-case time complexity of looking up a key in a Python dictionary (dict)?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        answerIndex: 2,
        explanation: 'Python dictionaries use hash tables, providing O(1) average-case key lookup.',
        xpReward: 35,
      },
    ],
  },
  {
    slug: 'database-sql-mastery',
    order: '04',
    sortOrder: 4,
    shortLabel: 'Database & SQL',
    title: 'Database & SQL Mastery',
    category: 'Data Engineering',
    level: 'Intermediate',
    summary:
      'Model clean relational schemas, master analytical SQL queries, tune slow indexes, and connect structured databases to real applications.',
    duration: '30 Hours',
    modulesLabel: '6 Modules',
    credential: 'SQL Sandbox Badge',
    imageKey: 'database-sql',
    imageAlt:
      'Illustration of glowing 3D crystal database cylinders connected to relational schema tables, primary key indicators, and ascending analytics charts',
    pillar: 'excel',
    iconKey: 'database',
    isFeaturedHero: true,
    outcomes: [
      'Design normalized relational schemas with primary keys, foreign keys & constraints',
      'Write high-clarity JOINs, CTEs, aggregations, and analytical window queries',
      'Diagnose and optimize query performance using B-Tree indexes & EXPLAIN plans',
      'Power live backend endpoints and reporting dashboards with safe parameterized SQL',
    ],
    tools: [
      { label: 'SQL Queries', logoKey: 'database' },
      { label: 'ER Modeling', logoKey: 'key' },
      { label: 'Analytics', logoKey: 'analytics' },
      { label: 'Data Integrity', logoKey: 'shield' },
    ],
    modules: [
      {
        title: 'Relational Data Modeling & Normalization',
        description: 'Entities, primary/foreign keys, 1NF–3NF normalization, and constraints.',
        outcome: 'Design clean, anomaly-free relational database schemas.',
        lessons: [
          {
            slug: 'keys-and-relationships',
            title: 'Primary Keys, Foreign Keys & Table Relationships',
            summary: 'Model one-to-many and many-to-many relationships cleanly.',
            durationMins: 30,
          },
        ],
      },
    ],
    questions: [
      {
        difficulty: 'medium',
        prompt: 'Which SQL clause filters grouped results after an aggregation such as COUNT() or SUM()?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
        answerIndex: 1,
        explanation: 'WHERE filters individual rows before grouping, whereas HAVING filters aggregated groups after GROUP BY.',
        xpReward: 35,
      },
    ],
  },
]

async function main() {
  for (const course of SEED_COURSES) {
    // Idempotent upsert: re-running seed refreshes nested curriculum cleanly without duplicates
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        order: course.order,
        sortOrder: course.sortOrder,
        shortLabel: course.shortLabel,
        title: course.title,
        category: course.category,
        level: course.level,
        summary: course.summary,
        duration: course.duration,
        modulesLabel: course.modulesLabel,
        credential: course.credential,
        imageKey: course.imageKey,
        imageAlt: course.imageAlt,
        pillar: course.pillar,
        iconKey: course.iconKey,
        isFeaturedHero: course.isFeaturedHero,
        isPublished: true,
        outcomes: {
          deleteMany: {},
          create: course.outcomes.map((text, idx) => ({ text, sortOrder: idx + 1 })),
        },
        tools: {
          deleteMany: {},
          create: course.tools.map((tool, idx) => ({
            label: tool.label,
            logoKey: tool.logoKey,
            sortOrder: idx + 1,
          })),
        },
        modules: {
          deleteMany: {},
          create: course.modules.map((mod, modIdx) => ({
            title: mod.title,
            description: mod.description,
            outcome: mod.outcome,
            sortOrder: modIdx + 1,
            lessons: {
              create: mod.lessons.map((lesson, lessonIdx) => ({
                slug: lesson.slug,
                title: lesson.title,
                summary: lesson.summary,
                durationMins: lesson.durationMins,
                sortOrder: lessonIdx + 1,
              })),
            },
          })),
        },
        questions: {
          deleteMany: {},
          create: course.questions.map((q, qIdx) => ({
            difficulty: q.difficulty,
            prompt: q.prompt,
            optionsJson: JSON.stringify(q.options),
            answerIndex: q.answerIndex,
            explanation: q.explanation,
            xpReward: q.xpReward,
            sortOrder: qIdx + 1,
          })),
        },
      },
      create: {
        slug: course.slug,
        order: course.order,
        sortOrder: course.sortOrder,
        shortLabel: course.shortLabel,
        title: course.title,
        category: course.category,
        level: course.level,
        summary: course.summary,
        duration: course.duration,
        modulesLabel: course.modulesLabel,
        credential: course.credential,
        imageKey: course.imageKey,
        imageAlt: course.imageAlt,
        pillar: course.pillar,
        iconKey: course.iconKey,
        isFeaturedHero: course.isFeaturedHero,
        isPublished: true,
        outcomes: {
          create: course.outcomes.map((text, idx) => ({ text, sortOrder: idx + 1 })),
        },
        tools: {
          create: course.tools.map((tool, idx) => ({
            label: tool.label,
            logoKey: tool.logoKey,
            sortOrder: idx + 1,
          })),
        },
        modules: {
          create: course.modules.map((mod, modIdx) => ({
            title: mod.title,
            description: mod.description,
            outcome: mod.outcome,
            sortOrder: modIdx + 1,
            lessons: {
              create: mod.lessons.map((lesson, lessonIdx) => ({
                slug: lesson.slug,
                title: lesson.title,
                summary: lesson.summary,
                durationMins: lesson.durationMins,
                sortOrder: lessonIdx + 1,
              })),
            },
          })),
        },
        questions: {
          create: course.questions.map((q, qIdx) => ({
            difficulty: q.difficulty,
            prompt: q.prompt,
            optionsJson: JSON.stringify(q.options),
            answerIndex: q.answerIndex,
            explanation: q.explanation,
            xpReward: q.xpReward,
            sortOrder: qIdx + 1,
          })),
        },
      },
    })
  }

  const [courseCount, moduleCount, lessonCount, questionCount] = await Promise.all([
    prisma.course.count(),
    prisma.courseModule.count(),
    prisma.lesson.count(),
    prisma.practiceQuestion.count(),
  ])

  console.log(
    `EduNexus DB (${useTurso ? 'Turso libSQL' : 'Local SQLite'}) seeded: ${courseCount} courses, ${moduleCount} modules, ${lessonCount} lessons, ${questionCount} questions.`,
  )
}

main()
  .catch((error) => {
    console.error('Failed to seed EduNexus database:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
