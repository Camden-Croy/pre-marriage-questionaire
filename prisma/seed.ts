// ============================================================================
// DATABASE SEED SCRIPT
// ----------------------------------------------------------------------------
// Seeds the database with pre-defined relationship prompts
// Requirement: 2.1 - Display a list of all pre-seeded prompts
// ============================================================================

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Pre-defined relationship prompts for the audit
 * These cover key areas of relationship compatibility and expectations
 */
const RELATIONSHIP_PROMPTS = [
  {
    title: "Daily Logistics & Priorities",
    text: `Walk through a typical weekday with **two school-aged children** (requiring active teaching) and a **toddler**, from 6:00 AM to 10:00 PM.

Consider:
- Who supervises the toddler during work or teaching hours?
- Who handles the math lesson? Who cooks dinner?
- If the plan includes *part-time work* or *maintaining a professional license*, where do those hours fit?

**When the schedule becomes unmanageable**, what gets cut first:
1. Professional work hours
2. Depth of homeschooling curriculum
3. Leisure time`,
    order: 1,
  },
  {
    title: "Theology vs. Psychology",
    text: `Imagine a child struggling with **deep anxiety and low self-worth**, expressing that they feel "broken" or "wrong."

Two frameworks often suggest different approaches:
- **Secular clinical**: Emphasizes self-love, validating inner feelings as truth, avoiding shame
- **Reformed Biblical**: Emphasizes identity in Christ, the reality of fallen nature, turning *outward* to God rather than inward

Questions to address:
1. If these frameworks suggest opposite solutions, which one takes precedence?
2. Can clinical tools (coping mechanisms, CBT) be used without adopting a secular worldview?
3. Name one psychological concept that would be **strictly off-limits** in the home.`,
    order: 2,
  },
  {
    title: "The Reality of Home Education",
    text: `Beyond the ideal of home education, consider the **practical burdens**.

**Contingency planning:**
- If the primary teacher is pregnant, ill, or experiencing burnout, what happens?
- Is sacrificing educational quality during hard seasons acceptable, or is outsourcing to schools/co-ops preferred?

**Curriculum vision:**
- Strictly religious and classical, or incorporating modern secular materials?
- How is success measured?`,
    order: 3,
  },
  {
    title: "Decision Making & Conflict Resolution",
    text: `Disagreement in marriage is inevitable.

**Define your understanding of:**
- *Headship* and *Submission* within the relationship

**Scenario:** A major decision (a move, large purchase, or church choice) has been discussed. After prayer and debate, fundamental disagreement remains.

Questions:
1. How is a final conclusion reached?
2. Who holds veto power?
3. What is the expected attitude of the other person once the decision is made?`,
    order: 4,
  },
  {
    title: "Financial Stewardship & Standard of Living",
    text: `Assuming a **single income** to facilitate parenting goals:

**Sacrifices:**
List three specific luxuries, habits, or conveniences currently enjoyed that could be given up *permanently* to make the budget work.

**Non-negotiables:**
What is one financial safety net that feels essential for security?

**Tension point:**
How should it be handled if the single income covers necessities but leaves little room for savings or vacations?`,
    order: 5,
  },
  {
    title: "Philosophy of Discipline",
    text: `Describe a philosophy of discipline across ages:
- **Toddler** (ages 2-4)
- **Teenager** (ages 13-16)

**Spectrum positioning:**
Where on the spectrum between *gentle parenting* and *authoritative biblical correction* (including physical discipline)?

**Rebellion scenario:**
If a child enters a season of rebellion—rejecting faith or household rules:
- How is their presence in the home handled?
- At what point do boundaries take precedence over unconditional acceptance?`,
    order: 6,
  },
  {
    title: "Medical Philosophy & Biological Trust",
    text: `Navigating the medical system requires trust.

**Stance on standard procedures:**
- Birth plans: home birth vs. hospital
- Childhood vaccination schedules

**Worldview:**
Is the medical establishment viewed as a generally benevolent authority to follow, or a secular system warranting skepticism?

**Disagreement resolution:**
In a disagreement regarding a medical procedure for a child, whose intuition carries more weight:
1. Mother's
2. Father's
3. Doctor's`,
    order: 7,
  },
  {
    title: "Technology, Privacy, and Data",
    text: `Digital privacy in a surveillance economy.

**Personal stance:**
- How important is digital privacy?
- What inconveniences are acceptable to protect family data?

**Rules and timelines for children:**
1. Access to the internet
2. Ownership of smartphones/social media
3. Presence of smart listening devices (virtual assistants) in living spaces`,
    order: 8,
  },
  {
    title: "Extended Family Influence",
    text: `Grandparents and extended family naturally want involvement in children's lives. However, worldviews may differ significantly.

**Boundaries to define:**
- What are the limits for unsupervised time with relatives who don't share the family's theology or lifestyle values?

**Conflict scenario:**
If a family member undermines parenting or teaches concepts deemed unbiblical:
- Is limiting or cutting off access acceptable?
- Even if it causes relational conflict?`,
    order: 9,
  },
  {
    title: "Cultural Engagement vs. Isolation",
    text: `Living in a suburban environment often means navigating consumerism and "Cultural Christianity."

**Balance question:**
How does a family remain distinct without becoming isolationist?

**Categorize activities as green light or red light:**
- Joining public school sports leagues (may require Sunday play)
- Participating in neighborhood holiday traditions (Halloween)
- Allowing access to popular streaming entertainment (Disney/Netflix) for peer reference

**Communication:**
How to explain to children why they can't do what neighbor kids are doing—without fostering bitterness?`,
    order: 10,
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing prompts (for development)
  await prisma.prompt.deleteMany();
  console.log("  Cleared existing prompts");

  // Insert all prompts
  const result = await prisma.prompt.createMany({
    data: RELATIONSHIP_PROMPTS,
  });

  console.log(`  Created ${result.count} prompts`);
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
