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
    text: `Daily Logistics & Priorities

Let's get very granular. Walk me through a specific Tuesday in our future life where we have two school-aged children (requiring active teaching) and a toddler. From 6:00 AM to 10:00 PM, block out the schedule. If the plan includes 'part-time work' or 'maintaining a professional license,' specifically slot those hours into this day. Who is supervising the toddler during those hours? Who is teaching the math lesson? Who is cooking dinner? If the schedule becomes unmanageable, what is the first thing to get cut: the professional work hours, the depth of the homeschooling curriculum, or our leisure time?`,
    order: 1,
  },
  {
    text: `Theology vs. Psychology

Let's look at a specific scenario where theology and psychology often collide. Imagine one of our children is struggling with deep anxiety and low self-worth, expressing that they feel 'broken' or 'wrong.' A secular clinical approach often emphasizes 'self-love,' validating the child's inner feelings as truth, and avoiding 'shame.' A Reformed Biblical approach often emphasizes our identity in Christ, the reality of our fallen nature, and turning *outward* to God rather than inward to self. If these two frameworks suggest opposite solutions, which one wins? Can we use clinical tools (like coping mechanisms or cognitive behavioral therapy) without adopting the secular worldview (that the self is sovereign)? Please give an example of one psychological concept you would strictly *forbid* in our home.`,
    order: 2,
  },
  {
    text: `The Reality of Home Education

We have discussed the desire to educate our children at home. Let's move beyond the 'ideal' and discuss the 'burden.' If the primary teacher is pregnant, ill, or experiencing burnout, what is the contingency plan? Are we willing to sacrifice the quality of education during hard seasons, or do we outsource to schools/co-ops? Furthermore, describe the *type* of curriculum you envision: is it strictly religious and classical, or does it incorporate modern secular materials? How do we measure success?`,
    order: 3,
  },
  {
    text: `Decision Making & Conflict Resolution

In a marriage, disagreement is inevitable. Please define your understanding of 'Headship' and 'Submission' within our relationship. In a practical scenario where we have discussed a major decision (e.g., a move, a large purchase, or a church choice) and—after prayer and debate—we still fundamentally disagree, how do we reach a final conclusion? Who holds the veto power, and what is the attitude of the other person once the decision is made?`,
    order: 4,
  },
  {
    text: `Financial Stewardship & Standard of Living

Assuming we operate on a single income to facilitate our parenting goals, what does our 'standard of living' look like? Please list three specific luxuries, habits, or conveniences you currently enjoy that you are willing to give up permanently to make the budget work. Conversely, what is one financial non-negotiable or 'safety net' you feel you *must* have to feel secure? How do we handle it if the single income covers the necessities but leaves little room for savings or vacations?`,
    order: 5,
  },
  {
    text: `Philosophy of Discipline

Describe your philosophy of discipline for a toddler (ages 2-4) compared to a teenager (ages 13-16). Where do you stand on the spectrum of 'gentle parenting' versus 'authoritative biblical correction' (including physical discipline)? If one of our children enters a season of rebellion—rejecting our faith or household rules—how do we handle their presence in our home? At what point do boundaries trump unconditional acceptance?`,
    order: 6,
  },
  {
    text: `Medical Philosophy & Biological Trust

Navigating the medical system requires trust. What is your stance on standard medical procedures, specifically regarding birth plans (home birth vs. hospital) and childhood vaccination schedules? Do you view the medical establishment as a generally benevolent authority we should follow, or a secular system we should be skeptical of? In a disagreement regarding a medical procedure for a child, whose intuition carries more weight: the mother's, the father's, or the doctor's?`,
    order: 7,
  },
  {
    text: `Technology, Privacy, and Data

We live in a surveillance economy. How important is digital privacy to you, and what inconveniences are you willing to accept to protect our family's data? Please specify your timeline and rules for our children regarding: 1) Access to the internet, 2) Ownership of smartphones/social media, and 3) The presence of 'smart' listening devices (like virtual assistants) in our living spaces.`,
    order: 8,
  },
  {
    text: `Extended Family Influence

Grandparents and extended family naturally want to be involved in our children's lives. However, their worldviews may differ drastically from ours. What are the boundaries for unsupervised time with relatives who do not share our theology or lifestyle values? If a family member undermines our parenting or teaches our children concepts we deem unbiblical, are you willing to limit or cut off access, even if it causes relational conflict?`,
    order: 9,
  },
  {
    text: `Cultural Engagement vs. Isolation

We intend to live in a suburban environment, which often comes with a culture of consumerism and 'Cultural Christianity.' How do we ensure our family remains distinct without becoming isolationist? What specific activities are 'green lights' and which are 'red lights'? Consider things like joining public school sports leagues (which may require Sunday play), participating in standard neighborhood holiday traditions (like Halloween), or allowing access to popular streaming entertainment (Disney/Netflix) to understand peer references. How do we explain to our children why they cannot do what the neighbor kids are doing without making them feel bitter?`,
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
