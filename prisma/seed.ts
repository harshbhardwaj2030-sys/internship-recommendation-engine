import { PrismaClient, CompanyTier, LocationType, InternshipStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean slate for repeatable seeding
  await prisma.application.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany({ where: { email: "demo@student.com" } });

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        companyName: "Nimbus Robotics",
        logoUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Nimbus",
        website: "https://nimbusrobotics.example.com",
        industry: "Robotics & Hardware",
        companyTier: CompanyTier.STARTUP,
        headquartersLocation: "Austin, TX",
        cultureTags: ["fast-paced", "hands-on", "flat-hierarchy"],
      },
    }),
    prisma.company.create({
      data: {
        companyName: "Ledgerline Financial",
        logoUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Ledgerline",
        website: "https://ledgerline.example.com",
        industry: "Fintech",
        companyTier: CompanyTier.MID_MARKET,
        headquartersLocation: "Chicago, IL",
        cultureTags: ["data-driven", "structured", "mentorship"],
      },
    }),
    prisma.company.create({
      data: {
        companyName: "Verdant Foods Co.",
        logoUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Verdant",
        website: "https://verdantfoods.example.com",
        industry: "Consumer / CPG",
        companyTier: CompanyTier.ENTERPRISE,
        headquartersLocation: "Minneapolis, MN",
        cultureTags: ["cross-functional", "sustainability", "brand-first"],
      },
    }),
    prisma.company.create({
      data: {
        companyName: "Halcyon Systems",
        logoUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Halcyon",
        website: "https://halcyonsystems.example.com",
        industry: "Cloud Infrastructure",
        companyTier: CompanyTier.BIG_TECH,
        headquartersLocation: "Seattle, WA",
        cultureTags: ["scale", "technical-depth", "on-call rotations"],
      },
    }),
    prisma.company.create({
      data: {
        companyName: "Studio Marrow",
        logoUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Marrow",
        website: "https://studiomarrow.example.com",
        industry: "Design & Creative Agency",
        companyTier: CompanyTier.STARTUP,
        headquartersLocation: "Brooklyn, NY",
        cultureTags: ["craft-focused", "small-teams", "client-facing"],
      },
    }),
  ]);

  const [nimbus, ledgerline, verdant, halcyon, marrow] = companies;

  const internships = [
    {
      companyId: nimbus.id,
      roleTitle: "Embedded Software Intern",
      domain: "Software Engineering",
      requiredSkills: ["C++", "Python", "Git", "Linux"],
      locationType: LocationType.ONSITE,
      stipendAmount: 2200,
      durationWeeks: 12,
      description:
        "Work alongside our firmware team building control software for autonomous warehouse robots. You'll write and test C++ modules that run on real hardware from day one.",
    },
    {
      companyId: nimbus.id,
      roleTitle: "Computer Vision Intern",
      domain: "Data Science",
      requiredSkills: ["Python", "PyTorch", "OpenCV", "Machine Learning"],
      locationType: LocationType.HYBRID,
      stipendAmount: 2500,
      durationWeeks: 12,
      description:
        "Improve the object-detection pipeline our robots use to navigate warehouse floors. You'll train and evaluate models against real sensor data.",
    },
    {
      companyId: ledgerline.id,
      roleTitle: "Full-Stack Engineering Intern",
      domain: "Software Engineering",
      requiredSkills: ["JavaScript", "React", "Node.js", "SQL"],
      locationType: LocationType.HYBRID,
      stipendAmount: 2000,
      durationWeeks: 10,
      description:
        "Build features for our internal ledger-reconciliation dashboard used by 40+ analysts. Ship a full feature end-to-end during your internship.",
    },
    {
      companyId: ledgerline.id,
      roleTitle: "Quantitative Analyst Intern",
      domain: "Data Science",
      requiredSkills: ["Python", "SQL", "Statistics", "Excel"],
      locationType: LocationType.ONSITE,
      stipendAmount: 2400,
      durationWeeks: 10,
      description:
        "Support the risk desk by building models that flag anomalous transaction patterns. Present findings directly to the trading team.",
    },
    {
      companyId: verdant.id,
      roleTitle: "Brand Marketing Intern",
      domain: "Marketing",
      requiredSkills: ["Content Writing", "Social Media", "Analytics", "Canva"],
      locationType: LocationType.REMOTE,
      stipendAmount: 1400,
      durationWeeks: 8,
      description:
        "Help plan and execute a product-launch campaign across social channels, working closely with the brand and growth teams.",
    },
    {
      companyId: verdant.id,
      roleTitle: "Supply Chain Data Intern",
      domain: "Data Science",
      requiredSkills: ["Excel", "SQL", "Python", "Statistics"],
      locationType: LocationType.HYBRID,
      stipendAmount: 1800,
      durationWeeks: 10,
      description:
        "Analyze distribution data to identify bottlenecks across our regional warehouses and present recommendations to operations leadership.",
    },
    {
      companyId: halcyon.id,
      roleTitle: "Cloud Infrastructure Intern",
      domain: "Software Engineering",
      requiredSkills: ["Go", "Kubernetes", "AWS", "Linux"],
      locationType: LocationType.ONSITE,
      stipendAmount: 3200,
      durationWeeks: 12,
      description:
        "Work on the platform team maintaining services that run at massive scale. You'll own a small service improvement from design to deployment.",
    },
    {
      companyId: halcyon.id,
      roleTitle: "Machine Learning Platform Intern",
      domain: "Data Science",
      requiredSkills: ["Python", "PyTorch", "Kubernetes", "Machine Learning"],
      locationType: LocationType.REMOTE,
      stipendAmount: 3400,
      durationWeeks: 12,
      description:
        "Help build the internal tooling that lets ML teams train and deploy models faster. Direct impact on hundreds of internal engineers.",
    },
    {
      companyId: marrow.id,
      roleTitle: "Product Design Intern",
      domain: "Design",
      requiredSkills: ["Figma", "UI Design", "Prototyping", "User Research"],
      locationType: LocationType.HYBRID,
      stipendAmount: 1600,
      durationWeeks: 10,
      description:
        "Design end-to-end flows for client web products, from wireframes to polished, animated prototypes presented directly to clients.",
    },
    {
      companyId: marrow.id,
      roleTitle: "Frontend Engineering Intern",
      domain: "Software Engineering",
      requiredSkills: ["JavaScript", "React", "CSS", "Figma"],
      locationType: LocationType.REMOTE,
      stipendAmount: 1700,
      durationWeeks: 8,
      description:
        "Turn agency design work into pixel-perfect, animated marketing sites for clients using React and modern CSS.",
    },
  ];

  for (const internship of internships) {
    await prisma.internship.create({
      data: { ...internship, status: InternshipStatus.ACTIVE },
    });
  }

  // A demo student account so the app is explorable immediately after seeding
  const passwordHash = await bcrypt.hash("demopassword123", 10);
  await prisma.user.create({
    data: {
      fullName: "Jordan Rivera",
      email: "demo@student.com",
      passwordHash,
      educationLevel: "JUNIOR",
      major: "Computer Science",
      skills: ["Python", "JavaScript", "React", "Git", "SQL"],
      domainInterests: ["Software Engineering", "Data Science"],
      locationPreference: "HYBRID",
      targetStipend: 2000,
      portfolioLinks: ["https://github.com/jordanrivera"],
      onboardingComplete: true,
    },
  });

  console.log("Seed complete: 5 companies, 10 internships, 1 demo user (demo@student.com / demopassword123).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
