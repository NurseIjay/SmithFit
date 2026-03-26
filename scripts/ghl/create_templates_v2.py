"""
SmithFit GHL Email Template Creator — v2
─────────────────────────────────────────
Creates all 35 email templates in GHL via API (32 existing + 3 new CANC templates).
Run once — skips any templates that already exist by name.
To force-update existing templates, the script will UPDATE them.

Usage:
  python3 scripts/ghl/create_templates_v2.py

Changes from v1:
  - BNDL-02 fixed: no longer assumes gameplan call is already complete
  - MILE-30 corrected: $5 gift card (was incorrectly labeled $10)
  - FOMO-C4 corrected: consistent $2.23/day math
  - Subject lines tightened across MEM, FOMO-C, MILE sequences
  - 3 new CANC-01/02/03 cancellation salvage emails added
  - Minor copy improvements for clarity and urgency throughout
"""

import sys
import os
import json
import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config


# ── HTML wrapper ─────────────────────────────────────────────────────────────

def wrap_html(body: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:30px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;color:#333333;max-width:600px;">
<tr><td>
<p style="font-size:13px;color:#888;margin-bottom:24px;">SmithFit | Built by a nurse, for nurses</p>
{body}
<hr style="border:none;border-top:1px solid #eeeeee;margin:32px 0;">
<p style="font-size:12px;color:#aaa;line-height:1.6;">
SmithFit &bull; hello@smithfit.online<br>
You're receiving this because you joined SmithFit.<br>
<a href="{{{{unsubscribe}}}}" style="color:#aaa;">Unsubscribe</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>"""


def p(text): return f'<p style="font-size:15px;line-height:1.7;margin:0 0 16px 0;">{text}</p>'
def h(text): return f'<h2 style="font-size:18px;font-weight:bold;margin:0 0 20px 0;color:#1a1a1a;">{text}</h2>'
def bold(text): return f'<strong>{text}</strong>'
def sig(): return p("— IJ Smith, RN<br>SmithFit Founder &amp; Head Coach")


# ── All 35 Templates ──────────────────────────────────────────────────────────
# v5 — Full audit and rewrite. Avatar-first copy, nurse-specific scenarios,
# emotional truth before features, one CTA per email, no shame/hustle culture.
# Fixed: BNDL-02 sequencing, MILE-30 gift card amount, FOMO-C4 math.
# Added: CANC-01, CANC-02, CANC-03 cancellation salvage sequence.
# Placeholders: [CALENDLY LINK] [BUNDLE UPGRADE LINK] [1-ON-1 APPLICATION LINK]
#               [MAILING FORM LINK] [GIFT CARD CODE] [ALUMNI OFFER LINK]
#               [PAUSE OPTION LINK] [PERSONAL CHECK-IN LINK]
#               [CANCELLATION CONFIRMATION LINK] [REFERRAL LINK]

TEMPLATES = [

    # ── MEMBERSHIP ONBOARDING ($67/mo) ────────────────────────────────────────

    {
        "name": "MEM-01: Welcome to SmithFit",
        "subject": "You're in. Here's exactly what to do in the next 20 minutes.",
        "html": wrap_html(
            h("You didn't fail your last program. It failed you.") +
            p("Hey {{contact.first_name}},") +
            p("Before I tell you what to do first, I need to say something that most coaches won't say:") +
            p("Every program you've tried before this one was built for someone who sleeps 8 hours, works 9-to-5, and has never spent 12 hours in fight-or-flight while their body quietly stores fat as a survival response.") +
            p("It wasn't discipline you were missing. It was a system built for your actual biology.") +
            p("That's what you have now. So let's use it.") +
            p(bold("The three things to do in the next 20 minutes:")) +
            p(bold("1. Download the SmithFit app (Trainerize).") + " Your weekly meal plans — Work Day, Off Day, and Chaos Day — are already loaded. So are your workouts and your 1,000+ recipe database. This is your home base.") +
            p(bold("2. Join the New SmithFit FAM community inside FitMetrics.") + " The weekly group coaching call schedule is pinned in the community tab. Show up to the first one you can — even just to listen. The nurses in that call are going to feel more familiar than you expect.") +
            p(bold("3. Make the Metabolic Cocktail tonight.") + " It's in Module 2. Three minutes. Water, ACV, lemon, pink salt — before your first coffee tomorrow. 87% of our members feel a measurable shift in energy within 72 hours. Not because it's magic. Because depleted adrenal glands finally get what they've been asking for.") +
            p("Here's what this program is not: a meal plan you follow perfectly or fail. It's not a workout streak you have to protect. It's not another thing to be disciplined about.") +
            p("It's a physiological reset — built around 12-hour shifts, missed breaks, 3am hunger, and the kind of exhaustion that doesn't respond to rest. Built by a nurse. For nurses.") +
            p("Your FitMetrics AI check-in will start learning your patterns this week. Your Chaos-Day Rescue Plans are in the app for the moment your perfect intentions meet a brutal shift. You have everything.") +
            p("The only thing left is Day 1. Make the cocktail. I'll check in on Day 2.") +
            sig()
        ),
    },

    {
        "name": "MEM-02: Did You Do the Cocktail",
        "subject": "Real talk — did you make the cocktail yet?",
        "html": wrap_html(
            h("I'm going to be that nurse who follows up.") +
            p("Hey {{contact.first_name}},") +
            p("Two days in. You probably had a shift somewhere in there.") +
            p("Quick question: did you make the Metabolic Cocktail?") +
            p("I ask because I've watched this exact pattern play out hundreds of times. Day 1 — motivated, read everything, ready to go. Then the next shift hits. Four hours of sleep, rushed out the door, grabbed coffee and whatever was fast. The cocktail was going to happen tomorrow.") +
            p("Tomorrow became three days ago.") +
            p("And now it feels like the window closed, like you missed something, like you're already behind.") +
            p("You're not behind. But I need you to understand why the cocktail is the non-negotiable starting point — not because it's a magic drink, but because of what it's actually doing.") +
            p("When you work rotating shifts, your cortisol pattern gets completely dysregulated. Your adrenal glands are running on empty — and depleted adrenals can't properly regulate your stress response, your hunger signals, or your fat metabolism. The cocktail is mineral replenishment. ACV improves insulin sensitivity for the next 4–6 hours. Pink salt replaces what your adrenals have burned through. Lemon activates digestion. Water before caffeine prevents the cortisol spike that coffee alone triggers on an empty stomach.") +
            p("Three minutes. Tomorrow morning before your first coffee.") +
            p("That's the ask. Just that.") +
            p("If you've already been making it — reply and tell me what you've noticed. Even a small thing. I read every response and I want to know.") +
            p("If you haven't started yet — tomorrow is your Day 1. The window didn't close. It's still open.") +
            sig()
        ),
    },

    {
        "name": "MEM-03: One Week In",
        "subject": "One week in — I want the honest version",
        "html": wrap_html(
            h("Seven days. Let's skip the highlight reel.") +
            p("Hey {{contact.first_name}},") +
            p("You've been a SmithFit member for one week. I'm not going to ask if everything went perfectly — because for a nurse with a real schedule, a perfect week isn't the goal. Showing up is the goal.") +
            p("So here's what I actually want to know:") +
            p("<em>Was this week better than the week before you joined?</em>") +
            p("Not dramatically better, necessarily. But different. A post-shift crash that was slightly less severe. One morning where you woke up and didn't immediately dread the day. A craving at 2am that you noticed instead of just surrendered to. A shift where you had something real to eat because you used the Chaos-Day plan instead of guessing.") +
            p("Those small shifts are the signal starting. Your nervous system has been running in survival mode for months — probably longer. One week doesn't erase that. But it begins the recalibration. And the recalibration compounds.") +
            p(bold("One focus for this week: your sleep anchor.")) +
            p("On your off days, try to wake within the same 90-minute window each morning. Not perfect — within range. This one intervention does more for your cortisol rhythm, hunger hormones, and fat metabolism than most supplements combined. It's the control panel for everything else.") +
            p("Also: if you haven't used the Chaos-Day Rescue Plan yet, pull it up before your next rough shift — not during it. The plan works best when it's already open before the chaos starts.") +
            p("Reply and tell me where you actually are. I'm not looking for a win story. I'm looking for the real one.") +
            sig() +
            p('<em>P.S. — A small number of SmithFit members decide early on that they want something more personalized — full-service 1-on-1 coaching where I\'m in your corner every step, not just in the community. That option exists by application only: <a href="[1-ON-1 APPLICATION LINK]">apply here</a> if you want to explore it.</em>')
        ),
    },

    {
        "name": "MEM-04: Two Weeks",
        "subject": "Two weeks in — and the voice in your head is lying to you",
        "html": wrap_html(
            h("Week two is where most people quit. Here's why — and what to do instead.") +
            p("Hey {{contact.first_name}},") +
            p("Two weeks in. And if I had to guess, a voice in your head is starting to negotiate.") +
            p("<em>\"Is this really working? I'm not seeing it yet. Maybe I need to try something different. Maybe this isn't the right program for my body. Maybe I should just wait until my schedule settles down.\"</em>") +
            p("I've been coaching nurses long enough to know: that voice shows up for almost everyone around Day 14. It's not intuition. It's your nervous system doing exactly what a stressed, cortisol-flooded nervous system does — it resists change and defaults to familiar patterns, even when those patterns aren't working.") +
            p("Here's what's actually happening in your body right now, under the surface where you can't see it yet:") +
            p("Your cortisol rhythm is resetting. Your leptin sensitivity — the hormone that tells your brain you're full and your body it's safe to burn stored fat — is starting to come back online after months of dysregulation. Your body is cautiously moving out of conservation mode. This process is invisible from the outside. The mirror won't show it yet. But it's real, and it's happening, and it took years to get dysregulated — two weeks of doing things right doesn't reverse that overnight.") +
            p("The nurses who push through this exact phase are the ones who transform completely. The ones who quit here are the ones who message me six months later and say <em>\"I should have stayed.\"</em>") +
            p(bold("One thing I need you to do this week:") + " Use the Chaos-Day Rescue Plan on your next chaotic shift — not your next easy day. The plan was built for the moments when everything falls apart. If you haven't tested it under real conditions yet, this week is the week.") +
            p("Show up to the weekly coaching call if you can. Ask whatever question has been sitting in your head. Week two is exactly when the community matters most.") +
            p("You haven't failed. You're right on schedule.") +
            sig()
        ),
    },

    {
        "name": "MEM-05: One Month In",
        "subject": "One month. You cleared the line that most people never reach.",
        "html": wrap_html(
            h("30 days in SmithFit. I need you to understand what that actually means.") +
            p("Hey {{contact.first_name}},") +
            p("One month.") +
            p("I want to put a real number on that: over 60% of people who buy a health program don't make it 30 days. Not because they don't want to change — because the program doesn't account for their real life. The 12-hour shifts. The 3am hunger that makes willpower irrelevant. The post-shift exhaustion that makes a workout feel impossible and skipping it feel like failure.") +
            p("You made it through all of that. You're still here.") +
            p("Something has shifted — even if you're not ready to name it yet. The energy pattern is more stable than it was. The crashes are duller. The craving at the end of a bad shift is still there, but it's not running your decisions the way it used to. If your scrubs fit even slightly differently this week, that's your body responding to 30 days of working with its physiology instead of against it.") +
            p("Take a photo today. Same spot, same outfit as Day 1 if you can. You might not see the difference yet — but in 30 more days you'll be glad you have it.") +
            p("I want to mention something briefly — not as a pitch, just because you've earned the right to know what's available at the next level:") +
            p("Some members at the 30-day mark start asking about tools that go deeper. " + bold("MealLens AI") + " scans any meal with your phone camera and gives instant metabolic feedback — no logging, no guessing, no counting. " + bold("BioSync") + " lets you upload your actual lab results and we interpret them through a metabolic lens — this is where chronic fatigue, stubborn weight, and sleep disruption start getting real answers. And a personal " + bold("60-minute gameplan call with me") + " where we map out the next 5 months specifically around your shift schedule.") +
            p("Those are inside the bundle upgrade. I'll walk you through the full details at Day 45. If you're curious before then, just reply.") +
            p("For now — you made it to Month 1. Month 2 is where it gets undeniable. Keep going.") +
            sig() +
            p('<em>P.S. — If you ever want to go all the way — full-service, fully personalized 1-on-1 coaching — that\'s a separate tier entirely. Application only: <a href="[1-ON-1 APPLICATION LINK]">apply here</a>.</em>')
        ),
    },

    {
        "name": "MEM-06: Day 45 — The Upgrade Email",
        "subject": "45 days in — an honest conversation about what's next for you",
        "html": wrap_html(
            h("45 days. You've proven this works. Now let's talk about how far you want to take it.") +
            p("Hey {{contact.first_name}},") +
            p("45 days in SmithFit. Your FitMetrics data is building a picture of your body's actual patterns — not what the internet says should happen, but what's happening specifically in your body, on your schedule, with your history.") +
            p("You're past the \"is this real\" phase. You're in the \"how far can I take this\" phase. So I'm going to give you the full picture.") +
            p(bold("Where you are now — $67/month:")) +
            p("Weekly shift-proof meal plans. 1,000+ recipe database. 15-minute workouts. Chaos-Day Rescue Plans. Weekly FitMetrics AI check-ins. Weekly group coaching call. New SmithFit FAM community. This is working. The results compound. Everything you need to keep going is already here.") +
            p(bold("The next level — 6-Month Bundle at $335 ($55.83/month):")) +
            p("Everything above, plus three tools that change how fast you progress:") +
            p(bold("60-minute personal gameplan call with me.") + " Not a group call — you and me, 60 minutes, building your roadmap for the next 5 months around your specific shift schedule, history, and goals. This call alone changes the trajectory.<br><br>"
              + bold("MealLens AI.") + " Point your phone camera at any meal — cafeteria hot line at midnight, hospital vending machine, post-shift takeout — and get instant metabolic feedback. No apps, no macros, no guessing. You'll finally know what the food you actually eat is doing to your body.<br><br>"
              + bold("BioSync Bloodwork Portal.") + " Upload your labs and we interpret them through a metabolic lens. Cortisol markers, thyroid function, inflammatory indicators — the things your PCP flags as 'normal' that we see very differently when we're looking at a night-shift nurse's physiology.") +
            p(bold("The 12-Month Bundle at $588 ($49/month):") + " Everything above, plus quarterly 20-minute check-in calls with me and VIP 1-on-1 community access for Month 1.") +
            p("The math is simple: staying monthly for 6 months costs $402. The 6-month bundle is $335. You save $67 and get three tools on top of it.") +
            p('<a href="[BUNDLE UPGRADE LINK]" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">See Bundle Options →</a>') +
            p("Questions? Reply. I'll give you a straight answer.") +
            sig() +
            p('<em>P.S. — There\'s a fourth option I don\'t advertise: full-service 1-on-1 coaching. Personalized everything, direct access, fastest possible results. Application only: <a href="[1-ON-1 APPLICATION LINK]">apply here</a> if you want to explore what that looks like for you specifically.</em>')
        ),
    },

    # ── BUNDLE ONBOARDING ──────────────────────────────────────────────────────

    {
        "name": "BNDL-01: Welcome Bundle",
        "subject": "Welcome to the bundle — book your gameplan call before your next shift",
        "html": wrap_html(
            h("You didn't just upgrade a membership. You decided to find out what's actually possible.") +
            p("Hey {{contact.first_name}},") +
            p("I want to say something before I walk you through your access:") +
            p("Most people stay comfortable. They try the baseline option, see some results, and stop before they find out what the full system can do for a body like theirs — a nurse's body, running on disrupted sleep and elevated cortisol and years of trying to outwork a physiology that was fighting back.") +
            p("You didn't stop there. That matters.") +
            p(bold("Here's everything you now have access to:")) +
            p("&#10003; " + bold("Everything in the Metabolic Membership") + " — weekly meal plans (Work/Off/Chaos Day), 1,000+ recipe database, 15-min workouts, Chaos-Day Rescue Plans, weekly group coaching call, FitMetrics AI check-ins, New SmithFit FAM community<br><br>"
              "&#10003; " + bold("MealLens AI") + " — scan any meal with your phone camera for instant metabolic feedback. The cafeteria at 2am is no longer a mystery.<br><br>"
              "&#10003; " + bold("BioSync Bloodwork Portal") + " — upload your labs and get a real metabolic interpretation. This is where the chronic fatigue, the stubborn weight, and the sleep disruption start getting explained at the root level.<br><br>"
              "&#10003; " + bold("VIP community access") + " — Month 1 priority support and direct connection in the New SmithFit FAM.<br><br>"
              "&#10003; " + bold("60-minute personal gameplan call with IJ") + " — this is the most important thing you do first. We build your entire roadmap together.") +
            p(bold("Book your gameplan call right now — before your next shift cycle starts:")) +
            p('<a href="[CALENDLY LINK]" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">Book Your 60-Min Gameplan Call →</a>') +
            p("This call is where I take everything I know about your physiology, your schedule, and your history — and turn it into a specific plan. Not a generic one. Yours.") +
            p("Reply to this email before you book and tell me: what's the one outcome you most want from the next 6 months? I'll be thinking about your answer before we get on the call.") +
            sig()
        ),
    },

    {
        "name": "BNDL-02: Your Gameplan",
        "subject": "While you wait for your gameplan call — your 4-week setup map",
        "html": wrap_html(
            h("Your gameplan call is booked. Now let's make sure Month 1 isn't wasted while you wait.") +
            p("Hey {{contact.first_name}},") +
            p("Your gameplan call is on the calendar. That's where we'll build your specific roadmap — your shifts, your history, your body's patterns, your next 5 months.") +
            p("But I don't want you to wait until that call to start. The nurses who get the most from their bundle don't treat Day 1 as the gameplan call — they treat Day 1 as today.") +
            p("Here's how to move in the days before your call:") +
            p(bold("This week — activate all three tools:") + "<br>"
              "Start with the Metabolic Cocktail daily — this is your anchor regardless of anything else. Pull up your Work Day meal plan and use it on your next work day, even imperfectly. Complete your first FitMetrics AI check-in so it has data before we talk.") +
            p(bold("Start using MealLens now:") + "<br>"
              "Scan 1–2 meals per day — your next hospital cafeteria run, your post-shift meal, whatever you're actually eating. You're building a data picture that we'll talk through on our call. Ten seconds per meal. Whatever you actually eat — vending machine included.") +
            p(bold("Upload bloodwork to BioSync:") + "<br>"
              "If you have anything from the last two years — even a routine annual panel — upload it before our call. Even a basic panel gives us useful baseline data. I look at markers your PCP typically files as 'normal' and reads them completely differently in the context of a night-shift nurse's metabolism. If you don't have labs, put 'get bloodwork' on your calendar for your next day off.") +
            p(bold("Get into the VIP community:") + "<br>"
              "Your Month 1 VIP access is active right now. Introduce yourself. Check the pinned posts. Show up to the weekly group coaching call before your gameplan call if you can — you'll come to our session with better questions.") +
            p("You are set up better than 95% of people who attempt to change their health while working shift work. The tools are built for your life. The call will make it specific to your body.") +
            p("Get started today. I'll see you on our call.") +
            sig()
        ),
    },

    {
        "name": "BNDL-03: One Week In",
        "subject": "Bundle Week 1 — quick tool check before life gets in the way",
        "html": wrap_html(
            h("One week since your bundle started. Three tools. Are all three active?") +
            p("Hey {{contact.first_name}},") +
            p("Week one of your bundle. I want to do something I do with every bundle member at this point: a quick tool audit. Not to check up on you — because the members who activate all three tools in Month 1 get dramatically better results than the ones who use one or two.") +
            p("And I don't want you to look back in three months and wonder what might have been different if you'd started MealLens in Week 1 instead of Week 6.") +
            p(bold("Tool 1: MealLens AI") + "<br>"
              "Have you scanned a meal yet? It takes 10 seconds. Open the app, tap the plus icon, tap Meal, point the camera, confirm. That's it. Your next meal — whatever it is, even if it's vending machine crackers and a hospital coffee — scan it. You're not being graded. You're building the data picture.") +
            p(bold("Tool 2: BioSync Bloodwork Portal") + "<br>"
              "Have you uploaded labs? If you have anything from the last two years — even a routine annual panel — upload it. We look at markers your PCP typically files as 'normal' and reads them completely differently in the context of a night-shift nurse's metabolism. Elevated reverse T3. Borderline cortisol. Subclinical thyroid patterns. These show up in bloodwork that looks fine on paper. If you don't have labs, put 'get bloodwork' on your calendar for your next day off.") +
            p(bold("Tool 3: VIP Community") + "<br>"
              "Are you active in the VIP section of the New SmithFit FAM? Month 1 VIP access means priority support and direct connection. The nurses who engage in the community during Month 1 are the ones who stay consistent through Months 3, 4, and 5 — because they've built relationships, not just routines. Don't let this window pass quietly.") +
            p("How is Week 1 actually feeling? Any questions that came up since your gameplan call? Reply — I'm following your progress.") +
            sig() +
            p('<em>P.S. — Some bundle members eventually realize they want full-service 1-on-1 coaching — where I\'m directly in your corner every step, not just on a quarterly call. That\'s available by application: <a href="[1-ON-1 APPLICATION LINK]">apply here</a> if you\'re curious about what that looks like.</em>')
        ),
    },

    {
        "name": "BNDL-04: VIP Month Ending",
        "subject": "Day 28 — I reviewed your FitMetrics data. Here's what I want to know.",
        "html": wrap_html(
            h("Day 28. I looked at your data. Now I want to hear from you directly.") +
            p("Hey {{contact.first_name}},") +
            p("It's Day 28 — which means I did my personal review of your FitMetrics check-in data. Every bundle member gets this at the one-month mark. It's not automated. I actually look.") +
            p("Here's what I look for at 28 days:") +
            p("First — " + bold("consistency patterns.") + " Not perfection. I'm looking at whether the signal is building. Are you showing up more days than not? Even 60% consistency at one month is meaningful data.<br><br>"
              "Second — " + bold("cortisol response indicators.") + " Sleep quality trends, energy stability across shift days vs. off days, craving frequency and intensity. These show up in how you answer your FitMetrics check-ins.<br><br>"
              "Third — " + bold("momentum markers.") + " Are your numbers improving week over week, holding flat, or declining? Flat can mean a plateau is coming. Declining needs a specific adjustment before Month 2.") +
            p("Here's what I want from you right now: reply to this email with your honest one-month update. What's working? What's not landing the way you expected? What question hasn't been answered yet?") +
            p("One practical note: your VIP community access transitions to standard membership after Month 1 — that's the designed structure. The New SmithFit FAM community stays fully active and the weekly coaching call continues as normal. VIP was Month 1 to give you maximum support during your highest-learning period.") +
            p("If you want to stay in the closest tier to personalized, ongoing support — the 12-month bundle adds quarterly check-in calls with me. Reply if you want to know what that looks like.") +
            p("You've done Month 1. Now the compound effect kicks in.") +
            sig() +
            p('<em>P.S. — Month 1 results are often what makes people curious about full-service 1-on-1 coaching. If that\'s where your mind is going, it\'s worth at least seeing if you qualify: <a href="[1-ON-1 APPLICATION LINK]">apply here</a>.</em>')
        ),
    },

    # ── FOMO TRACK A — Monthly → Bundle Upgrade ───────────────────────────────

    {
        "name": "FOMO-A1: One Month In",
        "subject": "Month 1 done — here's what bundle members have that you don't (yet)",
        "html": wrap_html(
            h("30 days in. You've proven you're committed. Now I want to show you what you're missing.") +
            p("Hey {{contact.first_name}},") +
            p("One month in SmithFit. Your consistency got you here. Your FitMetrics data is starting to tell a real story about your body's patterns.") +
            p("I want to be direct with you about something — not to pressure you, but because you've been here long enough to deserve the full picture:") +
            p("There are three tools inside the bundle that your current membership doesn't include, and they're the ones that take results from good to completely different.") +
            p(bold("MealLens AI") + " — point your phone camera at any meal and get instant metabolic feedback. The cafeteria food you're guessing on, the post-shift takeout, the random thing you ate at 3am because you were starving. MealLens removes the single biggest blind spot in your data: the food you eat but don't actually know the impact of. Bundle members who use it consistently lose fat at nearly double the rate of those who don't — because we finally know what we're working with.") +
            p(bold("BioSync Bloodwork Portal") + " — upload your labs and get a real metabolic interpretation. Most nurses I work with have bloodwork that their PCP called 'normal' that tells a very different story when you're looking at it through the lens of night-shift cortisol patterns, thyroid function under chronic stress, and inflammatory markers from disrupted sleep. BioSync is where the 'I've tried everything and nothing works' mystery starts getting solved.") +
            p(bold("A 60-minute personal gameplan call with me") + " — not a group call. You and me. Your shift schedule, your history, your body's data. 60 minutes to build a specific roadmap for the next 5 months. This call alone changes the trajectory.") +
            p("The 6-month bundle is $335 total — $55.83/month. You're currently at $67/month. Upgrading saves you $67 over 6 months and adds all three tools.") +
            p('<a href="[BUNDLE UPGRADE LINK]" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">See Bundle Options →</a>') +
            p("Reply if you have questions. I'll give you a straight answer.") +
            sig()
        ),
    },

    {
        "name": "FOMO-A2: She Lost 31 lbs",
        "subject": "She almost said no to the bundle. Then her bloodwork changed everything.",
        "html": wrap_html(
            h("Danielle almost didn't upgrade. I'm glad she changed her mind.") +
            p("Hey {{contact.first_name}},") +
            p("Danielle is an ICU nurse from Dallas. Night shift, rotating schedule, 41 years old. She'd been a monthly member for 6 weeks when I sent her the bundle email.") +
            p("Her response: <em>\"I'm getting results. I don't know if I need more tools.\"</em>") +
            p("She was right that she was getting results. She upgraded anyway — mostly because I told her to try BioSync before she decided.") +
            p("She uploaded her most recent bloodwork. It looked unremarkable on paper — her PCP had never raised any concerns. But when we looked at it through the lens of night-shift physiology, one thing stood out immediately: elevated reverse T3. Her thyroid was technically 'normal' by standard lab ranges, but her body wasn't converting T4 to active T3 at the rate it should be. Classic pattern in rotating-shift nurses. Her metabolism was operating at significantly reduced capacity — not because she was broken, but because her body had learned to conserve energy in response to years of cortisol disruption.") +
            p("We adjusted two things in her meal plan timing and added specific foods to her Work Day template. Nothing dramatic. Just precise.") +
            p("Six months later: down 31 lbs. Off a blood pressure medication her doctor had been recommending for two years. Sleeping through the day consistently for the first time in her nursing career.") +
            p("Her words: <em>\"The monthly membership was working. The bundle tools found what the program alone never could have.\"</em>") +
            p("The 6-month bundle is $335. MealLens, BioSync, the personal gameplan call — and everything you already have. <a href='[BUNDLE UPGRADE LINK]'>Details here.</a>") +
            sig() +
            p('<em>P.S. — Results like Danielle\'s sometimes make people curious about what 1-on-1 coaching could do for them specifically. That tier exists by application: <a href="[1-ON-1 APPLICATION LINK]">apply here</a> if you want to explore it.</em>')
        ),
    },

    {
        "name": "FOMO-A3: The Math on Month-to-Month",
        "subject": "The honest math on staying month-to-month",
        "html": wrap_html(
            h("I want to show you something most coaches won't put in writing.") +
            p("Hey {{contact.first_name}},") +
            p("This is the math email. Not a story, not a testimonial — just the numbers, laid out honestly, so you can make this decision with full information.") +
            p(bold("If you stay month-to-month for 6 months:") + " $402 total. You keep everything you have: meal plans, workouts, community, weekly coaching call, FitMetrics AI.") +
            p(bold("If you upgrade to the 6-month bundle:") + " $335 total. Same access — plus the 60-minute personal gameplan call with IJ, MealLens AI, BioSync Bloodwork Portal, and VIP community for Month 1. You save $67 and gain three tools.") +
            p(bold("If you upgrade to the 12-month bundle:") + " $588 total versus $804 at monthly pricing for a year. You save $216 annually. You also gain quarterly 20-minute check-in calls with IJ and VIP 1-on-1 community access for Month 1.") +
            p("The only rational reason to stay month-to-month is if you're genuinely not sure whether you want to commit to 6 months. That's a real reason and I respect it.") +
            p("But here's the thing: you're at Day 60. You've been here two months. You're not someone who's uncertain anymore. You're someone who's committed and just hasn't claimed the better deal yet.") +
            p("The bundle isn't a different program. It's the same system with more precision tools — the ones that take what's already working and make it work faster, smarter, and more specifically for your body.") +
            p('<a href="[BUNDLE UPGRADE LINK]" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">Upgrade Now →</a>') +
            sig()
        ),
    },

    {
        "name": "FOMO-A4: Last Call",
        "subject": "Last email about the bundle. Here's everything on the table.",
        "html": wrap_html(
            h("This is the last time I'll bring up the bundle. I want to make sure you have the full picture first.") +
            p("Hey {{contact.first_name}},") +
            p("This is my last email about upgrading to the bundle. I've said what I have to say — I'm not going to keep pushing.") +
            p("But before I go quiet on this, I want to lay out everything that's on the table one final time — because you've been here 75 days and you've earned a complete picture of your options.") +
            p(bold("Option 1 — Stay at $67/month.") + " Everything you have keeps running. The meal plans, workouts, weekly call, FitMetrics AI, community. It works. The results compound. There's nothing wrong with this choice.") +
            p(bold("Option 2 — 6-Month Bundle at $335.") + " Save $67, add the 60-minute gameplan call, MealLens AI, BioSync, and VIP Month 1 access. Best value for where you are right now.") +
            p(bold("Option 3 — 12-Month Bundle at $588.") + " Save $216 over the year. Add quarterly coaching calls with IJ and VIP 1-on-1 access Month 1. For the members who want to know what a full year of this system does.") +
            p(bold("Option 4 — Full-service 1-on-1 coaching.") + " This is a completely different tier — not a membership, not a bundle. Fully personalized coaching, direct access, the fastest possible path to results. It's application-only and it's not for everyone. But if you've been thinking since Day 1 that you want someone fully in your corner, this is that. <a href='[1-ON-1 APPLICATION LINK]'>Apply here.</a>") +
            p("Whatever you decide — I'm glad you've been here 75 days. Keep going regardless of which option you choose.") +
            sig()
        ),
    },

    # ── FOMO TRACK B — 6-Month → 12-Month Upgrade ────────────────────────────

    {
        "name": "FOMO-B1: 45 Days In",
        "subject": "45 days into your bundle — one question worth sitting with",
        "html": wrap_html(
            h("45 days in. You're building real momentum. I want to ask you something.") +
            p("Hey {{contact.first_name}},") +
            p("45 days into your SmithFit bundle. You've had your gameplan call. You've been using MealLens, exploring BioSync, showing up in the community. Your FitMetrics data is building a picture that didn't exist 6 weeks ago.") +
            p("I want to ask you one question worth sitting with:") +
            p("<em>What do you want your health to look like in 12 months — not 6?</em>") +
            p("I ask because there's a real difference between a 6-month result and a 12-month result — and it's not linear. The first 90 days resets the baseline. Days 90–180 is where fat loss accelerates and the habits stop feeling like effort. Months 7–12 is where nurses tell me things like <em>\"I don't recognize my old relationship with food\"</em> and <em>\"I can't remember the last time I dreaded going into shift.\"</em>") +
            p("The 12-month bundle gives you that full arc — with two things added that the 6-month doesn't have:") +
            p(bold("Quarterly 20-minute coaching calls with me.") + " Four times over the year, we review your data together, adjust your approach, and map the next 90 days. Not a group call. Not automated feedback. Your data and your goals, with me.") +
            p(bold("VIP 1-on-1 community access for Month 1") + " — agentic DM support during your highest-learning period of the new term.") +
            p("The price difference from your current 6-month bundle: $253. Four personal coaching check-ins and VIP access included.") +
            p("Not a pressure pitch — just an honest question about what you're building toward. Reply if you want to talk it through.") +
            sig()
        ),
    },

    {
        "name": "FOMO-B2: Coach In Your Pocket",
        "subject": "75 days in — what a full year actually does to a nurse's body",
        "html": wrap_html(
            h("Month 3 is coming. Here's what the data says happens after that.") +
            p("Hey {{contact.first_name}},") +
            p("75 days into your SmithFit bundle. The data in FitMetrics is real by now — you can see your own patterns in a way you couldn't three months ago.") +
            p("I want to tell you something about what a full year does that 6 months can't. Not because I want to sell you something — because I've watched this play out with enough nurses to know the difference is significant.") +
            p("Months 1–3: resetting the baseline. Cortisol regulation, leptin sensitivity, sleep architecture. This is the unsexy work that makes everything else possible.") +
            p("Months 3–6: acceleration. The baseline is set. The habits are automatic. The body starts releasing what it's been holding. The fat that wouldn't move starts moving. The energy stops crashing.") +
            p("Months 6–12: identity shift. This is the part that's hard to describe until you're in it. The program stops feeling like a program. The choices you make around food and movement stop requiring willpower. You're not fighting your biology anymore — you're working with it as a default. Nurses who make it to Month 12 consistently describe it the same way: <em>\"I don't recognize who I was when I started.\"</em>") +
            p("The 12-month bundle gives you that full arc — plus quarterly 20-minute check-ins with me to make sure Month 6 and Month 9 aren't navigated alone.") +
            p("The difference from your current 6-month bundle: $253. You'd spend more than that on one month of supplements that don't do half of what a quarterly coaching review does for your trajectory.") +
            p("Reply if you want to talk through whether the 12-month is right for where you are right now.") +
            sig()
        ),
    },

    {
        "name": "FOMO-B3: Month 3 Is Coming",
        "subject": "Month 3 is coming — this is the window that separates the results",
        "html": wrap_html(
            h("Day 100. Month 3 is here. This is where the split happens.") +
            p("Hey {{contact.first_name}},") +
            p("Day 100. Month 3 is officially here — and I want to talk about it honestly, because this is where I see the most dramatic difference between bundle members who go on to complete transformations and those who plateau and interpret it as failure.") +
            p("The split almost always comes down to one thing: " + bold("what happens when the results plateau.")) +
            p("Around Month 3, many members hit a window where the visible progress seems to slow. The habits are running. The system is working. But the scale isn't moving the way it was in Month 1, and the mirror is harder to read. The motivation that was easy in Month 1 requires more intention now.") +
            p("Members who have a check-in at this point — someone looking at their data and saying <em>\"here's what's happening, here's what to adjust, here's what to expect in the next 90 days\"</em> — those members don't interpret the plateau as failure. They adjust. They push through. They're the ones who message me at Month 6 and say <em>\"Month 3 was the turning point.\"</em>") +
            p("That check-in is exactly what the quarterly coaching call in the 12-month bundle is. 20 minutes. Your data. Your roadmap for the next 90 days. With me.") +
            p("You're at Day 100. The next 90 days are too important to navigate without that checkpoint.") +
            p('<a href="[BUNDLE UPGRADE LINK]" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">Upgrade to 12-Month Bundle →</a>') +
            sig() +
            p('<em>P.S. — Some members at Day 100 decide they want more than quarterly check-ins — they want someone fully in their corner. 1-on-1 coaching is available by application: <a href="[1-ON-1 APPLICATION LINK]">apply here</a>.</em>')
        ),
    },

    {
        "name": "FOMO-B4: Your 6-Month Commitment Ends",
        "subject": "Your 6-month bundle is ending — here are your four options",
        "html": wrap_html(
            h("Your 6-month bundle is coming to a close. Let's talk about what happens next.") +
            p("Hey {{contact.first_name}},") +
            p("Your 6-month bundle is ending soon. Before it does, I want to lay out your options clearly — all of them — because you've put in real work and you deserve to make this decision with complete information.") +
            p(bold("Option 1 — Upgrade to 12-Month Bundle ($588 total)") + "<br>"
              "Everything you have now, extended through Month 12 — plus quarterly 20-minute coaching calls with IJ and VIP 1-on-1 community access for the first month of your new term. Best value, most support within this system.") +
            p(bold("Option 2 — Renew the 6-Month Bundle ($335)") + "<br>"
              "Same as what you have now. Another 6 months of full bundle access — including a fresh 60-minute gameplan call with me, MealLens, BioSync, and VIP Month 1 access. A clean reset with everything that's been working.") +
            p(bold("Option 3 — Continue as Monthly Member ($67/month)") + "<br>"
              "The core Metabolic Membership stays active — meal plans, workouts, community, weekly coaching call, FitMetrics AI. No bundle tools, but the foundation keeps running.") +
            p(bold("Option 4 — Full-Service 1-on-1 Coaching (Application Only)") + "<br>"
              "The highest-touch tier we offer. Not automated. Not group. Fully personalized coaching with me — the fastest possible path to results. Your 6-month data makes you an ideal candidate if you want to explore it. <a href='[1-ON-1 APPLICATION LINK]'>Apply here.</a>") +
            p("Which direction feels right? Reply to this email and tell me where you're leaning. I'll help you think through it.") +
            sig()
        ),
    },

    # ── MILESTONE CELEBRATION EMAILS ──────────────────────────────────────────

    {
        "name": "MILE-30: One Month Strong",
        "subject": "One month. You crossed the line most people never reach.",
        "html": wrap_html(
            h("30 days in SmithFit. Here's what that actually means.") +
            p("Hey {{contact.first_name}},") +
            p("One month.") +
            p("I want to put a real number on this: over 60% of people who start a health program don't make it 30 days. Not because they don't want to change — because the program wasn't built for their real life. The 12-hour shifts. The rotating schedule. The 3am hunger that makes willpower completely irrelevant.") +
            p("You made it through all of that and you're still here.") +
            p("As a thank you — a " + bold("$5 Amazon gift card") + " is on its way. You'll receive the code in a separate email within 24 hours. Spend it on something that makes you feel good.") +
            p("But here's what I actually want more than anything:") +
            p("<em>What is the biggest non-scale change you've noticed in the last 30 days?</em>") +
            p("Not the weight. Not the measurements. The thing that surprised you. The shift that ended differently than they used to. The 2am craving that was quieter. The morning you woke up and didn't immediately dread the day.") +
            p("Reply and tell me. Genuinely — because the answer someone gives me at Day 30 is often the exact thing another nurse needs to hear to decide this is worth trying.") +
            p("Month 2 is where it gets undeniable. Keep going.") +
            sig()
        ),
    },

    {
        "name": "MILE-60: 60-Day Shifter",
        "subject": "60 days. Two months of choosing yourself. Your $10 is inside.",
        "html": wrap_html(
            h("Two months of showing up through shifts, chaos days, and exhausted mornings. That's real.") +
            p("Hey {{contact.first_name}},") +
            p("Sixty days.") +
            p("Most fitness programs lose 60% of their members before they get here. You've made it twice as far as the average — and not because your schedule was easier than theirs. Because you kept showing up when it wasn't convenient, when the shift was brutal, when the cocktail almost didn't get made.") +
            p("A " + bold("$10 Amazon gift card") + " is coming your way — code in a separate email within 24 hours.") +
            p("And I want to ask you something directly:") +
            p(bold("Can we share your story?")) +
            p("Not a polished before-and-after. Not a staged photo. Just 2–3 sentences in your own words — what brought you here, what's different now, what you'd tell a nurse friend who's skeptical.") +
            p("The nurse who is right where you were 60 days ago — skeptical, exhausted, convinced her body is broken — she's watching. She needs to hear from you, specifically, because you're her. Same shifts. Same schedule. Same history of trying things that didn't stick.") +
            p("Reply with 2–3 honest sentences. That's all. I'll take care of the rest.") +
            sig()
        ),
    },

    {
        "name": "MILE-90: 90-Day Identity Shift",
        "subject": "90 days. You are genuinely not the same person who joined.",
        "html": wrap_html(
            h("Ninety days in SmithFit. This is the milestone almost nobody reaches.") +
            p("Hey {{contact.first_name}},") +
            p("Ninety days.") +
            p("I want to be specific about what that means physiologically — not just motivationally. At 90 days of consistent cortisol regulation, your nervous system has built new default patterns. The adrenal response to shift stress is measurably different. Your leptin sensitivity has reset enough that hunger signals are starting to mean something again instead of just firing constantly in the background. The habits that required conscious decision-making in Month 1 are running automatically.") +
            p("You are not the same person who joined 90 days ago. That's not a figure of speech. It's a biological fact.") +
            p("Here's your thank you: a " + bold("$15 Amazon gift card") + " — code in a separate email within 24 hours. And we're sending you something in the mail — fill out your address here so we know where to send it: " + bold('[<a href="[MAILING FORM LINK]">mailing address form</a>]') + ". Keep an eye on your mailbox in the next 10 days.") +
            p("One ask in return: a 30-second phone video. Face to camera. Tell another nurse watching right now — one who's where you were 90 days ago, skeptical and exhausted and not sure if her body will ever respond — why she should join SmithFit.") +
            p("You don't need a script. You don't need good lighting. You need 30 seconds of the truth. That video will reach nurses I can't reach with any ad I'll ever run.") +
            p("Reply if you're willing and I'll send you exactly where to upload it. Five minutes. Genuine impact.") +
            sig()
        ),
    },

    {
        "name": "MILE-180: Six-Month Transformation",
        "subject": "Six months. I wrote you something I want you to read alone.",
        "html": wrap_html(
            h("Half a year. There are things I want to say to you that I don't write in group posts.") +
            p("Hey {{contact.first_name}},") +
            p("Read this when you have a quiet moment. Not between patients. Not while you're getting ready for a shift. When you actually have two minutes to be still.") +
            p("Six months ago you made a decision that most people spend years talking about and never actually make. You decided — despite the schedule, despite the exhaustion, despite the history of things that didn't work — that you were worth the investment. That your body wasn't broken, it just needed a system built for your actual life.") +
            p("And then you showed up. Month after month. Through rough shift series and chaotic weeks and the moments when the old patterns tried to pull you back.") +
            p("I see the data. I see the consistency. I see what you've built — and I want you to understand that it's real, it's yours, and nobody can take it from you.") +
            p("Your " + bold("$25 Amazon gift card") + " is coming via separate email within 24 hours.") +
            p("And I want to invite you to something: a real feature. Your story, on the SmithFit page, in your words. The nurses who are where you were six months ago — the ones who almost didn't join, who were sure their body was different, who've tried everything — they need to see your face attached to a result. They need to know that someone with your schedule, your history, your body, made it to six months and came out the other side.") +
            p("Reply when you're ready. I'll send you three questions. Your answers become the feature. Ten minutes of your time. Potentially the thing that changes someone else's life.") +
            sig()
        ),
    },

    {
        "name": "MILE-365: One Full Year",
        "subject": "One year in SmithFit. $75 is on its way to you.",
        "html": wrap_html(
            h("One year. I have things to say that I've been saving for this moment.") +
            p("Hey {{contact.first_name}},") +
            p("One year.") +
            p("I built SmithFit in 2022 because I was watching what shift work was doing to the nurses around me — and what it had done to me. The cortisol belly that showed up out of nowhere. The exhaustion that didn't respond to rest days. The weight that didn't respond to effort. The moment I looked in the mirror and genuinely didn't recognize myself.") +
            p("I knew the mechanism. I was an RN. I understood the physiology. And I could not fix it with any program that existed for people with normal schedules and normal cortisol levels.") +
            p("So I built something different. And then I watched nurses use it and change — not just physically, but in the way they carry themselves. The way they feel walking into shift. The way they make decisions under pressure.") +
            p("You are proof that what I built works. A full year. Every shift, every chaotic week, every moment the old version of you would have quit. You stayed.") +
            p("I'm sending you a " + bold("$75 Amazon gift card") + " — code in a separate email within 24 hours. Because you didn't just complete a program. You became a different person.") +
            p("There's also something in your follow-up email — a way to stay in this community at a rate that reflects what you mean to it. I hope you take it.") +
            p("One last ask: would you be willing to get on a 10-minute call with me? Not coaching. Just a conversation. I want to hear your year in your own words. What brought you here. What changed. What you'd tell the version of yourself from 365 days ago.") +
            p("You've done something most people only talk about. Thank you.") +
            sig()
        ),
    },

    {
        "name": "MILE-50WO: 50 Workouts",
        "subject": "50 workouts logged. That number represents something specific.",
        "html": wrap_html(
            h("50 workouts. Let me tell you what that number actually means.") +
            p("Hey {{contact.first_name}},") +
            p("You just logged your 50th workout in SmithFit.") +
            p("50 times you chose to move your body when you had every reason not to. Post-12-hour-shift sessions. Pre-shift mornings when your body was still recovering. Days when you modified half the movements because you were sore or exhausted or simply done.") +
            p("50 decisions. Every single one of them mattered.") +
            p("Here's what most people don't realize about workout consistency at shift-work pace: showing up for a 15-minute workout after a night shift is worth more — metabolically and psychologically — than a 60-minute perfect workout done when rested. Because the signal you're sending your nervous system is <em>\"we do this regardless of how hard the shift was.\"</em> That signal rewires the default. It becomes identity, not effort.") +
            p("Your " + bold("$15 Amazon gift card") + " is coming via separate email within 24 hours.") +
            p("One ask: screenshot your workout count in the SmithFit app and post it in the New SmithFit FAM community. Don't just let that number live in your phone. Show it — because somewhere in that community right now, there's a nurse on workout 3 who needs to see that workout 50 is possible. She needs to see your name attached to it.") +
            p("Workout 100 has an even bigger surprise waiting. Keep going.") +
            sig()
        ),
    },

    # ── REFERRAL ───────────────────────────────────────────────────────────────

    {
        "name": "REF-01: Share SmithFit — Earn Your Membership Free",
        "subject": "You can earn your SmithFit membership for free. Here's how.",
        "html": wrap_html(
            h("You're 45 days in. Here's how to make SmithFit free.") +
            p("Hey {{contact.first_name}},") +
            p("You've been in SmithFit for 45 days. You know what this program does. You've felt the shift — the cocktail becoming automatic, the post-shift hunger quieter, the morning you woke up before your alarm and weren't immediately dreading everything.") +
            p("I want to ask you something:") +
            p(bold("Is there a nurse in your life who needs this?")) +
            p("She's working the same shifts. Same schedule. Same history of things that didn't stick. She's said \"I need to do something\" at least a dozen times this year. And every time, she's talked herself out of it — too tired, too skeptical, too burned by the last thing she tried.") +
            p("You know exactly who she is because you were her 45 days ago.") +
            p("Here's what happens when you refer her:") +
            p("&#10003; " + bold("She gets the $27 Reset Course free") + " — her risk-free way in<br>"
              "&#10003; " + bold("You get $10") + " for every nurse who joins and stays 30+ days<br>"
              "&#10003; " + bold("Refer 5 active members → your membership is free") + " — every month, as long as they stay<br>"
              "&#10003; " + bold("10 active referrals → $50 every quarter") + " just for being in the community") +
            p("This isn't a hustle. It's not a pyramid. It's just: you changed, she needs to change, and there's a way to connect the two that also rewards you for the trust you're lending to this program.") +
            p("Your unique referral link: " + bold("[REFERRAL LINK]")) +
            p("Send it in a text. Drop it in your hospital group chat. DM the one person you've been thinking about this whole time. You already know who it is.") +
            p(bold("P.S.") + " — The nurses who refer tend to stay longer themselves. There's something about introducing someone else to the program that re-anchors your own commitment. That's not accidental. Community compounds.") +
            sig()
        ),
    },

    # ── FOMO TRACK C — Free Trial → Paid ──────────────────────────────────────

    {
        "name": "FOMO-C1: Your 14-Day Free Trial Starts Now",
        "subject": "Your 14-day trial just started — do this before your next shift",
        "html": wrap_html(
            h("14 days. Full access. Let's not waste a single one.") +
            p("Hey {{contact.first_name}},") +
            p("Your free trial just started. And I want to be upfront with you about how to make these 14 days actually count — because I've seen people go through a trial and never really try it, and then wonder why they didn't feel anything.") +
            p("The nurses who feel this program in 14 days are the ones who use it like they've already decided to stay. Not perfectly — but actually.") +
            p("Here's what full access looks like right now:") +
            p("&#10003; " + bold("Weekly shift-proof meal plans") + " — Work Day, Off Day, and Chaos Day templates inside the app<br>"
              "&#10003; " + bold("1,000+ recipe database") + " — filterable by prep time, shift type, and what you're craving<br>"
              "&#10003; " + bold("15-minute cortisol-conscious workouts") + " — designed for a body that worked 12 hours yesterday<br>"
              "&#10003; " + bold("Chaos-Day Rescue Plans") + " — for the shift that wrecks your best intentions<br>"
              "&#10003; " + bold("Weekly FitMetrics AI check-ins") + " — learning your patterns from Day 1<br>"
              "&#10003; " + bold("Weekly group coaching call") + " — live with IJ and the SmithFit team<br>"
              "&#10003; " + bold("New SmithFit FAM community") + " — nurses who understand your schedule without explanation") +
            p(bold("Before your next shift — do these three things:")) +
            p("1. Download the SmithFit app (Trainerize) and find your Work Day meal plan.<br>"
              "2. Join the New SmithFit FAM community in FitMetrics. Check the pinned post for the weekly coaching call schedule.<br>"
              "3. Make the Metabolic Cocktail — Module 2 of the program. Three minutes. 87% of members feel a real energy shift within 72 hours of starting it consistently.") +
            p("At Day 14, you'll decide whether to continue at $67/month. If you do — nothing resets. Your data, your plan, your progress all carry forward.") +
            p("But that decision is 14 days away. Today, just start.") +
            sig()
        ),
    },

    {
        "name": "FOMO-C2: Day 3 Check-In",
        "subject": "Day 3 — what's different so far? (honest question)",
        "html": wrap_html(
            h("Day 3. The honest check-in.") +
            p("Hey {{contact.first_name}},") +
            p("Day 3 of your trial. You've probably had at least one shift since you started.") +
            p("I want to ask you something and I want the honest answer, not the optimistic one:") +
            p("<em>Is anything different?</em>") +
            p("At Day 3, most members who made the Metabolic Cocktail consistently are noticing something small. The post-shift crash didn't hit as hard. The 2am craving was quieter than usual. They woke up from their day sleep feeling slightly more rested than the week before. Not dramatic — just different. A softer edge on the exhaustion.") +
            p("That's the cortisol regulation beginning. Not finished — beginning. The adrenal glands getting mineral replenishment they've been depleted of for months. The nervous system receiving a signal that it's safe to start downregulating.") +
            p("If you're feeling it: that's real. Keep going. It compounds.") +
            p("If you're not feeling anything yet — two questions: Have you made the cocktail consistently? Even twice out of three days counts as consistent in Week 1. And have you had a chance to check the New SmithFit FAM community and find the weekly coaching call time?") +
            p("14 days moves fast. The nurses who get the most from a trial treat Day 3 the same way they treat Day 10 — like they've already decided this is their system and they're learning how it works specifically for their body.") +
            p("What are you noticing? Reply and tell me. I'm reading.") +
            sig()
        ),
    },

    {
        "name": "FOMO-C3: Halfway",
        "subject": "Day 7 — halfway through your trial. The honest conversation.",
        "html": wrap_html(
            h("Halfway. Let's have the real conversation.") +
            p("Hey {{contact.first_name}},") +
            p("Seven days in. Halfway through your trial.") +
            p("I want to skip the sales pitch and just talk to you like a nurse.") +
            p("The question that matters right now isn't whether SmithFit is worth $67/month in some abstract sense. The question is: <em>has something actually changed for you in the last 7 days?</em>") +
            p("If the answer is yes — even something small, even something you'd be embarrassed to call a 'result' because it doesn't sound impressive enough — that change is real. And $67/month keeps it building. Nothing resets at Day 14. Your FitMetrics data, your meal plan, your workout program, your place in the community — it all carries forward. The shift you're feeling right now doesn't disappear. It continues.") +
            p("If the answer is honestly no — I want to know why. Is it the schedule? The cocktail not happening consistently? Haven't found the community yet? Haven't been able to make it to a coaching call? Tell me, because those are all solvable problems, and 7 days of not-quite-clicking is very different from 7 days of actually trying and not getting anything.") +
            p("Seven days left. The nurses who get the most from a trial are the ones who lean in hardest in the second half. Pull up the Chaos-Day plan this week and actually use it on a rough shift. Show up to the coaching call even if you just listen. Make the cocktail every single morning for the next 7 days and notice what changes.") +
            p("Reply and tell me where you are. I'll respond personally.") +
            sig()
        ),
    },

    {
        "name": "FOMO-C4: Keep Everything for $2.23/Day",
        "subject": "4 days left — keep everything for $2.23/day",
        "html": wrap_html(
            h("4 days left. Here's the decision broken down to its simplest form.") +
            p("Hey {{contact.first_name}},") +
            p("Four days left in your trial. I want to put the decision in the simplest possible terms.") +
            p("$67 divided by 30 days: $2.23 per day.") +
            p("For $2.23 a day you keep:") +
            p("Your weekly meal plans — Work Day, Off Day, Chaos Day — updated every week inside the app.<br>"
              "Your 1,000+ recipe database.<br>"
              "Your 15-minute workouts, progressing as your body adapts.<br>"
              "Your Chaos-Day Rescue Plans — for every shift that doesn't go according to plan.<br>"
              "Your FitMetrics AI check-ins, which are already learning your patterns.<br>"
              "Your weekly coaching call with IJ and the SmithFit team.<br>"
              "Your place in the New SmithFit FAM community.") +
            p("Less than a hospital vending machine coffee. For a system that was built specifically for how you live.") +
            p("And here's the thing about Day 14: it's not the end of something. It's the beginning of Month 2 — which is where the results that were quiet in the first two weeks start becoming impossible to ignore.") +
            p("Reply 'YES' right now and I'll make sure your access continues without interruption. Nothing resets. Nothing disappears. You just keep going.") +
            sig()
        ),
    },

    {
        "name": "FOMO-C5: She Almost Cancelled on Day 11",
        "subject": "She almost cancelled on Day 11. Here's what she told me six months later.",
        "html": wrap_html(
            h("I need to tell you about Keisha.") +
            p("Hey {{contact.first_name}},") +
            p("Keisha is an LPN from Atlanta. Night shift. Single mom. Three kids and a rotating schedule that makes most people's heads spin.") +
            p("She joined SmithFit on a free trial and almost didn't continue on Day 11.") +
            p("Her exact words: <em>\"I can probably find this stuff for free online. I don't know if I can justify another monthly expense. I'm already stretched.\"</em>") +
            p("I asked her one question: <em>\"In the last 11 days — just be honest with me — has anything actually been different?\"</em>") +
            p("She went quiet for a moment. Then: <em>\"My energy on shift is different. The crash doesn't come the same way it used to. And the 2am craving — it's there, but it's not screaming at me like it was. I actually made a different choice twice this week without even thinking about it.\"</em>") +
            p("She continued. $67/month.") +
            p("Six months later: down 22 lbs. Off two blood pressure medications her doctor had recommended for over a year. Sleeping through the day for the first time in four years of night shift. Using the Chaos-Day plan on every single chaotic shift — which in the ICU is most of them.") +
            p("Her words at Month 6: <em>\"I almost let $67 talk me out of the best health decision I have ever made in my nursing career. I am so glad I stayed.\"</em>") +
            p("You have 3 days left. You've built something real in the last 11. The decision you make in the next 72 hours is exactly what Keisha was facing.") +
            p("Reply 'YES' to continue. I'll make sure your access is seamless.") +
            sig()
        ),
    },

    {
        "name": "FOMO-C6: Your Trial Ends Today",
        "subject": "Your trial ends today. One question before it does.",
        "html": wrap_html(
            h("Today is Day 14. Here's the only thing that matters right now.") +
            p("Hey {{contact.first_name}},") +
            p("Your 14-day trial ends today.") +
            p("I'm not going to write you a long email. You've been here 14 days. You know better than I do what you've experienced — the shifts you've been through, whether the energy felt different, whether the cocktail became a habit, whether you found yourself making a different choice in the cafeteria at 2am.") +
            p("So the only question that matters right now:") +
            p("<em>Did something shift?</em>") +
            p("If yes — even something small, even something you'd be embarrassed to call a result — $67/month keeps it going. Everything stays exactly as it is. Your FitMetrics data, your plan, your progress, your place in the community. Nothing resets. You just keep going.") +
            p("If you're genuinely not sure — reply to this email right now and tell me what's holding you back. I'll answer honestly. If there's something I can address, I will. If it's truly not the right fit, I'll tell you that too.") +
            p("But if something shifted: reply 'YES' right now. I'll make sure your access is seamless and uninterrupted.") +
            p("You came here because something needed to change. 14 days ago you decided to try. Today you decide what happens next.") +
            sig()
        ),
    },

    {
        "name": "FOMO-C7: You Left. The Door Is Still Open.",
        "subject": "You left. No guilt. The door is still open.",
        "html": wrap_html(
            h("Your trial ended. I want to say one thing before I go quiet.") +
            p("Hey {{contact.first_name}},") +
            p("Your trial ended and you didn't continue. I respect that decision — I'm not going to follow up six times and try to change your mind.") +
            p("But I want to say one thing honestly before I go quiet:") +
            p("Whatever stopped you — the $67, the timing, the exhaustion of adding one more thing to a life that's already full, the quiet fear that your body is just too far gone to respond the way you want it to — those reasons are real. I'm not here to argue with any of them.") +
            p("What I do know is this: the cortisol pattern that's making fat loss feel impossible, that's driving the 2am cravings, that's behind the sleep that never quite resets your energy — it doesn't go away on its own. Shift work keeps doing what shift work does. The physiology that's working against you right now will keep working against you until someone interrupts it with the right tools.") +
            p("You were 14 days into an interruption. Something was starting.") +
            p("When you're ready — next week, next month, whenever life creates an opening — the membership is $67/month. Same program. Same community. Same results. The door doesn't close.") +
            p("Reply to this email whenever you want back in. I'll be here.") +
            sig()
        ),
    },

    # ── CANCELLATION SALVAGE ──────────────────────────────────────────────────
    # Triggered when: contact has `cancellation-requested` tag added.
    # Goal: Retain the member. 3-email sequence over 7 days.

    {
        "name": "CANC-01: Before You Go",
        "subject": "Before you cancel — I want to understand why",
        "html": wrap_html(
            h("You're thinking about leaving. Before you do — can I ask you one thing?") +
            p("Hey {{contact.first_name}},") +
            p("I saw that you reached out about cancelling your SmithFit membership.") +
            p("I'm not going to pretend that's not disappointing — because it is. But I'm also not going to respond with a pitch. I want to respond like a nurse who genuinely cares what's going on with you.") +
            p("Because here's what I know after coaching hundreds of nurses: when someone thinks about leaving a program that was working, there's almost always a specific reason behind it. And most of those reasons are more fixable than they seem in the moment.") +
            p(bold("Can you tell me which of these is closest to your situation?")) +
            p("<strong>A — It's the cost.</strong> Money got tight. The $67/month feels hard to justify right now, even when the program is helping.<br><br>"
              "<strong>B — I'm not seeing results.</strong> I've been showing up but I'm not feeling the difference I expected, and I'm starting to wonder if this works for my body.<br><br>"
              "<strong>C — Life got too busy.</strong> I want to keep going but the shifts, the schedule, everything — I haven't had the bandwidth to actually use the program lately.") +
            p("Reply with A, B, or C — or tell me in your own words. I'm reading this personally.") +
            p("Here's what I can offer depending on your answer:") +
            p("If it's " + bold("cost") + " — I can pause your membership instead of cancelling. You keep your account and your data. Access pauses. We restart when you're ready. No pressure, no penalty.<br><br>"
              "If it's " + bold("results") + " — I want to personally review what's been happening in your FitMetrics check-ins and get you a direct answer. Not a canned response. A real one.<br><br>"
              "If it's " + bold("life") + " — I want to tell you about our reduced-intensity track. Same system, less pressure. Built for nurses who can't be consistent right now but don't want to lose the ground they've built.") +
            p("You don't have to have it figured out. Just reply or click below and tell me what's going on.") +
            p('<a href="[PAUSE OPTION LINK]" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">Pause Instead of Cancel →</a>') +
            p("Or just reply to this email. I'll be here.") +
            sig()
        ),
    },

    {
        "name": "CANC-02: The Real Reason Most Nurses Quit",
        "subject": "The real reason most nurses quit — and the one thing that changes it",
        "html": wrap_html(
            h("She was three days away from quitting. Here's what happened when she stayed.") +
            p("Hey {{contact.first_name}},") +
            p("I want to tell you about a nurse named Renee.") +
            p("Renee is an RN from Houston. Night shift, 44 years old, two kids in high school. She joined SmithFit in February and by Day 42, she was ready to cancel.") +
            p("Her reason: <em>\"I don't feel like I'm progressing. I've been trying and I just don't see it. Maybe my body is too far gone.\"</em>") +
            p("I asked her to stay one more week. Not a month — one week. And I told her something that I want to tell you right now, because it changed everything for Renee and it's true for your body too:") +
            p(bold("Cortisol regulation takes 6 to 8 weeks to stabilize.")) +
            p("That's not a tagline. That's physiology. When your nervous system has been running in chronic fight-or-flight — which happens to every nurse who works 12-hour shifts over months and years — the adrenal recalibration doesn't happen in two weeks. It doesn't show up on a scale in 30 days. It builds underground, invisible, until it breaks the surface all at once.") +
            p("Renee was at Day 42. Three days away from the window where everything starts compounding.") +
            p("She stayed.") +
            p("By Day 60, she'd lost 9 lbs. By Day 90, her coworkers were asking what she was doing differently. At Month 6: down 27 lbs, sleeping through the day for the first time in years, off a thyroid medication she'd been on since her second pregnancy.") +
            p("Her words to me at six months: <em>\"I was so close to letting everything I'd already built just disappear. I am so grateful I stayed three more days.\"</em>") +
            p("If you're at Day 30, 40, or 45 — you may be right where Renee was. Right before the compounding begins.") +
            p("Stay one more month. That's all I'm asking. And I'll personally check in with you at the 30-day mark to review your data and tell you honestly what I see.") +
            p('<a href="[PERSONAL CHECK-IN LINK]" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">Stay — I Want That Check-In →</a>') +
            p("Or reply to this email and tell me where you are. I'll respond personally.") +
            sig()
        ),
    },

    {
        "name": "CANC-03: Last Chance — Help You Decide Clearly",
        "subject": "Your last chance — and a decision I want to help you make clearly",
        "html": wrap_html(
            h("I'm not going to beg. But I am going to be completely honest with you.") +
            p("Hey {{contact.first_name}},") +
            p("This is my last email before your cancellation processes.") +
            p("I've sent two emails this week. I've tried to understand what's going on and offer real options. At this point, I want to give you the clearest possible picture — not to pressure you, but because you deserve to make this decision with full information, not in a frustrated moment after a hard shift.") +
            p(bold("If you leave SmithFit, here's what you keep:")) +
            p("The knowledge from the program — the cortisol science, the Metabolic Cocktail, the shift-based eating structure. That's yours. Nothing erases it. If you've built any habits over the last several weeks, those don't disappear.") +
            p(bold("Here's what you lose:")) +
            p("Weekly updated meal plans — Work Day, Off Day, Chaos Day.<br>"
              "Access to your FitMetrics AI data and check-in history.<br>"
              "Your 1,000+ recipe database.<br>"
              "Your 15-minute workouts, updated and progressive.<br>"
              "The weekly group coaching call with IJ and the SmithFit team.<br>"
              "Your place in the New SmithFit FAM community.<br>"
              "The accountability structure that makes this work when life gets hard.") +
            p("You also lose the compounding. The results that come from Months 2, 3, and 4 don't happen in isolation. They happen because you stayed in the system. Walking away now means starting from zero the next time you decide to try.") +
            p(bold("One last option I want to put on the table:")) +
            p("If the cost is the issue, I can offer you one month at a reduced rate before you make a final decision. Reply to this email and just say \"reduced rate\" — I'll take care of it personally. This isn't something I advertise. It's for members who were genuinely using the program and hit a hard moment financially.") +
            p("If you've made up your mind and you're ready to go, I respect that completely. Click below and your cancellation will be confirmed. No hard feelings, no guilt trip. The door stays open.") +
            p('<a href="[CANCELLATION CONFIRMATION LINK]" style="display:inline-block;background:#888888;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">Confirm Cancellation →</a>') +
            p("Whatever you decide — I'm grateful you were here. The work you put in was real. You didn't fail anything.") +
            sig()
        ),
    },

]


# ── API Functions ─────────────────────────────────────────────────────────────

BASE_URL = config.BASE_URL


def list_existing_templates() -> dict:
    """Return a dict of {name: id} for templates already in GHL."""
    url = f"{BASE_URL}/emails/builder"
    params = {"locationId": config.GHL_LOCATION_ID, "limit": 100}
    try:
        resp = requests.get(url, headers=config.HEADERS, params=params, timeout=15)
        if resp.status_code == 200:
            builders = resp.json().get("builders", [])
            return {t.get("name", ""): t.get("id", "") for t in builders}
        return {}
    except Exception:
        return {}


def create_template_shell(name: str, subject: str) -> str:
    """Create a template shell in GHL and return its ID."""
    url = f"{BASE_URL}/emails/builder"
    payload = {
        "locationId": config.GHL_LOCATION_ID,
        "name": name,
        "subject": subject,
        "type": "html",
        "fromName": "IJ Smith — SmithFit",
        "fromEmail": "hello@smithfit.online",
    }
    resp = requests.post(url, headers=config.HEADERS, json=payload, timeout=15)
    if resp.status_code in (200, 201):
        data = resp.json()
        return data.get("id", data.get("_id", ""))
    raise Exception(f"Create failed: HTTP {resp.status_code} — {resp.text[:200]}")


def set_template_html(template_id: str, html: str, name: str = "", subject: str = "") -> dict:
    """Set the HTML content for an existing template."""
    url = f"{BASE_URL}/emails/builder/data"
    payload = {
        "templateId": template_id,
        "locationId": config.GHL_LOCATION_ID,
        "updatedBy": "SmithFit",
        "editorType": "html",
        "body": html,
        "html": html,
    }
    if name:
        payload["name"] = name
        payload["title"] = name
    if subject:
        payload["subject"] = subject
    resp = requests.post(url, headers=config.HEADERS, json=payload, timeout=15)
    return {"status": resp.status_code, "body": resp.json() if resp.content else {}}


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("\n" + "=" * 60)
    print("  SMITHFIT — CREATE/UPDATE GHL EMAIL TEMPLATES (v2)")
    print("=" * 60 + "\n")

    try:
        config.validate()
    except EnvironmentError as e:
        print(e)
        sys.exit(1)

    print("  Fetching existing templates from GHL...")
    existing = list_existing_templates()
    print(f"  Found {len(existing)} existing template(s).\n")

    created = 0
    updated = 0
    failed = 0

    for t in TEMPLATES:
        name = t["name"]
        try:
            if name in existing:
                template_id = existing[name]
                action = "UPDATE"
            else:
                template_id = create_template_shell(name, t["subject"])
                action = "CREATE"

            result = set_template_html(template_id, t["html"], name=name, subject=t.get("subject", ""))
            if result["status"] in (200, 201):
                print(f"  OK  {action}D  {name}")
                if action == "CREATE":
                    created += 1
                else:
                    updated += 1
            else:
                print(f"  FAILED  {name}  (HTTP {result['status']})")
                print(f"      {json.dumps(result['body'], indent=2)[:200]}")
                failed += 1
        except Exception as e:
            print(f"  ERROR   {name}: {e}")
            failed += 1

    print(f"\n{'=' * 60}")
    print(f"  Done. Created: {created}  |  Updated: {updated}  |  Failed: {failed}")
    print(f"{'=' * 60}\n")

    if failed > 0:
        print("  Some templates failed. Check the response above.")
        print("  If you see a 401 — your GHL_API_KEY may be expired.")
        print("  If you see a 404 — reply to IJ's Claude session for help.\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
