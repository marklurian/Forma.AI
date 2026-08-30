export type BodyPart = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";
export type EquipmentCategory = "Barbell" | "Dumbbell" | "Bodyweight" | "Cable" | "Machine";

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  bodyPart: BodyPart;
  category: EquipmentCategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  primaryMuscle: string;
  secondaryMuscles: string[];
  instructions: {
    setup: string;
    execution: string[];
    tips: string[];
    commonMistakes: string[];
  };
  videoEmbedId: string;
  defaultBarWeightLbs: number;
}

export const EXERCISE_LIBRARY: ExerciseLibraryItem[] = [
  /* ═════════════════════ [ A ] ═════════════════════ */
  {
    id: "lib-ab-wheel",
    name: "Ab Wheel Rollout",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Advanced",
    primaryMuscle: "Rectus Abdominis & Transverse Abdominis",
    secondaryMuscles: ["Latissimus Dorsi", "Shoulders", "Hip Flexors"],
    instructions: {
      setup: "Kneel on a soft mat with your knees hip-width apart and hold the ab wheel handles directly under your shoulders.",
      execution: [
        "Brace your core tight and tilt your pelvis slightly posterior to flatten your lower back.",
        "Roll the wheel forward in a controlled straight line, extending your hips and arms until your body is nearly parallel to the floor.",
        "Squeeze your abs and pull your hips and wheel back toward your knees to return."
      ],
      tips: [
        "Never let your lower back sag into hyperextension.",
        "Focus on flexing the spine and pulling with the abdominals, not the hips."
      ],
      commonMistakes: [
        "Arching the lower back at full extension.",
        "Initiating the return by sitting back onto your heels with hips first."
      ]
    },
    videoEmbedId: "rqiTPdK1cWg",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-arnold-press",
    name: "Arnold Dumbbell Press",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Anterior & Lateral Deltoids",
    secondaryMuscles: ["Triceps Brachii", "Upper Trapezius", "Rotator Cuff"],
    instructions: {
      setup: "Sit on an upright bench with dumbbells held at collarbone level, palms facing your chest as if at the top of a bicep curl.",
      execution: [
        "Press the dumbbells overhead while rotating your wrists outward 180 degrees.",
        "At the top of the press, your palms should face away from you with arms fully extended.",
        "Reverse the rotational motion smoothly as you lower the weights back to the start."
      ],
      tips: [
        "Keep the rotation fluid and continuous throughout the pressing ascent.",
        "Avoid clanking the dumbbells together at the top."
      ],
      commonMistakes: [
        "Rotating prematurely before clearing shoulder level.",
        "Using excessive momentum from the back."
      ]
    },
    videoEmbedId: "3ml7BH7mNwQ",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-assisted-pullup",
    name: "Assisted Pull-Up",
    bodyPart: "Back",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Latissimus Dorsi",
    secondaryMuscles: ["Biceps Brachii", "Rhomboids", "Middle Trapezius"],
    instructions: {
      setup: "Set the counterbalance weight pin (heavier weight provides more assistance). Place your knees on the padded platform and grip the overhand handles.",
      execution: [
        "Depress your shoulder blades down and pull your chest upward toward the bar.",
        "Drive your elbows toward your hips until your chin clears the bar.",
        "Lower under steady control until arms are fully extended at the bottom."
      ],
      tips: [
        "Progressively reduce the counterweight as your pulling strength increases.",
        "Keep your core braced to avoid swinging on the platform."
      ],
      commonMistakes: [
        "Relying solely on arm pulling without engaging the back.",
        "Dropping down rapidly without an eccentric contraction."
      ]
    },
    videoEmbedId: "81smqN1b90E",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ B ] ═════════════════════ */
  {
    id: "lib-barbell-squat",
    name: "Barbell Back Squat",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Quadriceps & Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Erector Spinae", "Core & Calves"],
    instructions: {
      setup: "Position the bar on your upper traps (high bar) or rear delts (low bar). Stand with feet shoulder-width apart, toes turned outward ~15–30 degrees.",
      execution: [
        "Brace your core with a deep diaphragmatic breath into your belt.",
        "Hinge hips and knees simultaneously, descending until your hip crease is below the knee plane.",
        "Drive forcefully through mid-foot to stand back up, driving knees outward."
      ],
      tips: [
        "Keep your chest upright and maintain neutral spine throughout the descent.",
        "Press knees out in line with toes during the ascent."
      ],
      commonMistakes: [
        "Knee cave (valgus collapse).",
        "Rounding the lower back at the bottom of the squat (butt wink)."
      ]
    },
    videoEmbedId: "bEv6CCg2BC8",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-bench",
    name: "Barbell Bench Press",
    bodyPart: "Chest",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Pectoralis Major (Mid & Lower Chest)",
    secondaryMuscles: ["Anterior Deltoids", "Triceps Brachii", "Serratus Anterior"],
    instructions: {
      setup: "Lie flat on the bench with eyes directly under the racked bar. Plant feet firmly on the floor. Grip the bar slightly wider than shoulder-width and retract shoulder blades.",
      execution: [
        "Unrack the bar and stabilize it directly over your chest with locked elbows.",
        "Inhale and lower the bar under control until it lightly touches your mid-sternum, keeping elbows tucked at ~45 degrees.",
        "Drive through your feet and press the bar back up forcefully to full lockout."
      ],
      tips: [
        "Maintain a slight natural arch in your lower back with glutes pinned to the bench.",
        "Think of bending the bar into a U-shape to engage your lats."
      ],
      commonMistakes: [
        "Bouncing the bar off your sternum.",
        "Flaring elbows straight out at 90 degrees."
      ]
    },
    videoEmbedId: "rT7DgCr-3pg",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-barbell-row",
    name: "Barbell Bent-Over Row",
    bodyPart: "Back",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Latissimus Dorsi & Rhomboids",
    secondaryMuscles: ["Trapezius", "Posterior Deltoids", "Biceps", "Lower Back"],
    instructions: {
      setup: "Stand with feet hip-width apart holding a barbell with an overhand grip. Hinge forward at the hips to roughly a 45-degree angle with a flat back.",
      execution: [
        "Pull the barbell up toward your lower ribcage / navel, driving elbows backward.",
        "Squeeze your shoulder blades together hard at the top contraction.",
        "Lower the bar smoothly until arms are fully extended."
      ],
      tips: [
        "Keep your knees slightly bent to relieve hamstring tension.",
        "Do not bounce your upper body up and down to create false momentum."
      ],
      commonMistakes: [
        "Rounding the lower back.",
        "Standing too upright (turning it into a shrug)."
      ]
    },
    videoEmbedId: "FWJR5Ve8gkQ",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-barbell-curl",
    name: "Barbell Bicep Curl",
    bodyPart: "Arms",
    category: "Barbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii",
    secondaryMuscles: ["Brachialis", "Brachioradialis", "Forearm Flexors"],
    instructions: {
      setup: "Stand tall holding a barbell with an underhand grip at shoulder-width. Keep elbows pinned close to your sides.",
      execution: [
        "Curl the bar upward toward your upper chest, contracting the biceps fully.",
        "Pause and squeeze your biceps at the peak of the curl.",
        "Lower the barbell under control with a steady 2-second eccentric phase."
      ],
      tips: [
        "Keep your torso completely stationary without swinging hips.",
        "Use an EZ-bar if straight barbell causes wrist discomfort."
      ],
      commonMistakes: [
        "Swinging the lower back to kickstart the weight.",
        "Flaring elbows forward excessively."
      ]
    },
    videoEmbedId: "kwG2ipFRgfo",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-hip-thrust",
    name: "Barbell Hip Thrust",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Quadriceps", "Adductors"],
    instructions: {
      setup: "Sit on the floor with your upper back against a bench and a padded barbell placed directly over your hips.",
      execution: [
        "Plant feet flat on the floor shoulder-width apart, shins vertical at top.",
        "Drive through your heels and extend hips upward until thighs and torso form a straight horizontal line.",
        "Squeeze glutes intensely at full lockout, then lower under control."
      ],
      tips: [
        "Keep your chin tucked and look forward, not up at the ceiling.",
        "Ensure full hip extension without hyperextending the lumbar spine."
      ],
      commonMistakes: [
        "Placing feet too far forward (hamstrings take over) or too close (quads take over).",
        "Overarching lower back at the top."
      ]
    },
    videoEmbedId: "SEdqd1n0cvg",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-bulgarian",
    name: "Bulgarian Split Squat",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Gluteus Medius",
    secondaryMuscles: ["Hamstrings", "Adductors", "Calves"],
    instructions: {
      setup: "Stand 2–3 feet in front of a bench. Elevate one foot on the bench behind you. Hold dumbbells at your sides.",
      execution: [
        "Lower your hips down and slightly back until your front thigh is parallel to the ground.",
        "Keep your front shin vertical and torso slightly hinged forward for glute activation.",
        "Drive through the front heel to return to the top position."
      ],
      tips: [
        "85% of your weight should be distributed on your front leg.",
        "Keep hips square to the front throughout every rep."
      ],
      commonMistakes: [
        "Pushing off the rear toe instead of the front heel.",
        "Knee caving inward."
      ]
    },
    videoEmbedId: "2C-uNgKwPLE",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ C ] ═════════════════════ */
  {
    id: "lib-cable-crossover",
    name: "Cable Crossover Fly",
    bodyPart: "Chest",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Sternal Head (Mid & Lower Pectorals)",
    secondaryMuscles: ["Anterior Deltoids", "Biceps Short Head"],
    instructions: {
      setup: "Set cable pulleys to high position. Grab handles, take a step forward into a staggered stance, and lean slightly forward.",
      execution: [
        "With a slight bend in your elbows, bring handles together in a sweeping downward hug motion.",
        "Cross your hands slightly at the bottom to maximize peak contraction.",
        "Allow cables to pull your arms back slowly for a deep chest stretch."
      ],
      tips: [
        "Imagine hugging a large tree trunk to keep elbow angle fixed.",
        "Keep your chest proud and shoulder blades slightly retracted."
      ],
      commonMistakes: [
        "Pressing the cables forward like a bench press instead of flying.",
        "Letting shoulders shrug up during the eccentric stretch."
      ]
    },
    videoEmbedId: "taI4XduLpBe",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-cable-lateral",
    name: "Cable Lateral Raise",
    bodyPart: "Shoulders",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Lateral Deltoid",
    secondaryMuscles: ["Supraspinatus", "Upper Trapezius"],
    instructions: {
      setup: "Set low pulley at wrist/ankle height. Stand sideways and grip handle with the far arm, cable running behind or in front of your legs.",
      execution: [
        "Raise the cable outward and upward until your upper arm is parallel to the floor.",
        "Lead with your elbow and pause briefly at shoulder height.",
        "Lower under constant continuous cable tension back to the start."
      ],
      tips: [
        "Cables maintain constant mechanical tension at the bottom where dumbbells have zero.",
        "Lean slightly away from the machine to increase the resistance profile."
      ],
      commonMistakes: [
        "Using body swing to yank the cable off the bottom.",
        "Lifting above shoulder height and engaging the upper traps."
      ]
    },
    videoEmbedId: "PPrzBWZDOhA",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-cable-woodchopper",
    name: "Cable Woodchopper",
    bodyPart: "Core",
    category: "Cable",
    difficulty: "Intermediate",
    primaryMuscle: "Internal & External Obliques",
    secondaryMuscles: ["Transverse Abdominis", "Shoulders", "Hips"],
    instructions: {
      setup: "Set high cable pulley. Stand sideways with feet wide, holding handle with both hands over your high shoulder.",
      execution: [
        "Rotate your torso downward and across your body toward your opposite knee in a chopping motion.",
        "Pivot on your back foot as you twist, keeping arms relatively straight.",
        "Control the return back to the high position."
      ],
      tips: [
        "Power the motion with your abdominal oblique rotation, not your arms.",
        "Keep hips and core braced throughout."
      ],
      commonMistakes: [
        "Bending elbows and pulling with arms.",
        "Rounding the back during the twist."
      ]
    },
    videoEmbedId: "pZapRXZcggk",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-chest-dips",
    name: "Chest Dips",
    bodyPart: "Chest",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Lower Pectorals & Triceps",
    secondaryMuscles: ["Anterior Deltoids", "Rhomboids"],
    instructions: {
      setup: "Mount parallel dip bars with arms straight and locked. Lean your torso forward 30 degrees and bend knees.",
      execution: [
        "Lower your body by bending elbows until upper arms are parallel to the floor or just below.",
        "Flare elbows out slightly ~45 degrees to target chest pectorals.",
        "Press forcefully through your palms back to full lockout."
      ],
      tips: [
        "A forward torso lean shifts emphasis from triceps to lower chest.",
        "Add a weight belt once bodyweight dips become easy."
      ],
      commonMistakes: [
        "Staying completely upright (isolates triceps instead of chest).",
        "Descending too deep with poor shoulder mobility."
      ]
    },
    videoEmbedId: "2z8JmcrW-As",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-chin-ups",
    name: "Chin-Ups (Underhand)",
    bodyPart: "Back",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Latissimus Dorsi & Biceps Brachii",
    secondaryMuscles: ["Brachialis", "Forearms", "Teres Major"],
    instructions: {
      setup: "Grip pull-up bar with an underhand supinated grip (palms facing you) at shoulder width. Hang at full extension.",
      execution: [
        "Drive elbows down and back while pulling your chest upward toward the bar.",
        "Pull until your chin is cleanly over the bar.",
        "Lower under full control back to a dead hang stretch."
      ],
      tips: [
        "The underhand grip places higher mechanical leverage on the biceps compared to overhand pull-ups.",
        "Keep core tight to eliminate leg swinging."
      ],
      commonMistakes: [
        "Kicking legs to generate momentum.",
        "Cutting range of motion at top or bottom."
      ]
    },
    videoEmbedId: "b-_S5aflP_4",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ D ] ═════════════════════ */
  {
    id: "lib-deadlift",
    name: "Deadlift (Conventional Barbell)",
    bodyPart: "Back",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Posterior Chain (Glutes, Hamstrings, Erector Spinae)",
    secondaryMuscles: ["Latissimus Dorsi", "Trapezius", "Forearms", "Quadriceps"],
    instructions: {
      setup: "Stand with mid-foot under the barbell, feet hip-width apart. Hinge down and grip bar just outside your shins.",
      execution: [
        "Pull your chest up, pack your lats, and take slack out of the barbell.",
        "Push floor away with legs, keeping bar in contact with shins and thighs.",
        "Lock hips and knees at top by squeezing glutes into full standing posture."
      ],
      tips: [
        "Keep the bar dragged against your legs throughout the entire lift.",
        "Maintain high intra-abdominal pressure (Valsalva maneuver)."
      ],
      commonMistakes: [
        "Rounding the lumbar spine under load.",
        "Jerking bar off floor without pre-tension."
      ]
    },
    videoEmbedId: "op9kVnSso6Q",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-db-bench",
    name: "Dumbbell Bench Press",
    bodyPart: "Chest",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Pectoralis Major",
    secondaryMuscles: ["Anterior Deltoids", "Triceps Brachii"],
    instructions: {
      setup: "Sit on a flat bench with dumbbells on knees. Kick them up and lie back, positioning dumbbells at chest sides with palms facing forward.",
      execution: [
        "Press dumbbells upward and slightly inward in an arc until arms are extended over chest.",
        "Lower under control until you feel a deep comfortable pectoral stretch.",
        "Repeat without clanking dumbbells together."
      ],
      tips: [
        "Dumbbells allow greater pectoral stretch and natural wrist rotation than a fixed barbell.",
        "Keep shoulder blades pinned to the bench."
      ],
      commonMistakes: [
        "Dropping weights too fast without control.",
        "Flaring elbows at 90 degrees."
      ]
    },
    videoEmbedId: "VmB1G1K7v94",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-db-curl",
    name: "Dumbbell Bicep Curl",
    bodyPart: "Arms",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii",
    secondaryMuscles: ["Brachialis", "Forearms"],
    instructions: {
      setup: "Stand or sit holding dumbbells at sides, palms facing inward (neutral grip).",
      execution: [
        "Curl weights upward while supinating wrists (turning palms up toward ceiling).",
        "Squeeze biceps at top contraction.",
        "Lower slowly back to neutral starting position."
      ],
      tips: [
        "Supinating wrists at top maximizes peak bicep contraction.",
        "Perform alternating or bilateral reps."
      ],
      commonMistakes: [
        "Swinging elbows backward or forward.",
        "Using back momentum."
      ]
    },
    videoEmbedId: "sAq_ocpRh_I",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-db-flyes",
    name: "Dumbbell Chest Flyes",
    bodyPart: "Chest",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Pectoralis Major (Mid Chest)",
    secondaryMuscles: ["Anterior Deltoids", "Biceps Short Head"],
    instructions: {
      setup: "Lie on flat bench holding dumbbells directly over chest with palms facing each other and elbows slightly bent.",
      execution: [
        "Lower dumbbells outward in a wide lateral arc until you feel a deep stretch across chest.",
        "Maintain fixed elbow bend throughout the descent.",
        "Bring dumbbells back together over chest as if hugging a barrel."
      ],
      tips: [
        "Do not over-stretch beyond normal shoulder flexibility.",
        "Focus on chest squeeze rather than moving heavy weight."
      ],
      commonMistakes: [
        "Turning fly into a bench press by bending elbows to 90 degrees.",
        "Dropping dumbbells below shoulder plane."
      ]
    },
    videoEmbedId: "eozdVDA78K0",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-hammer-curl",
    name: "Dumbbell Hammer Curl",
    bodyPart: "Arms",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Brachialis & Brachioradialis",
    secondaryMuscles: ["Biceps Brachii (Long Head)", "Forearms"],
    instructions: {
      setup: "Stand tall holding dumbbells with palms facing each other in a neutral grip throughout the movement.",
      execution: [
        "Curl dumbbells upward while keeping palms facing each other.",
        "Squeeze at the top point when forearms reach near vertical.",
        "Lower with control over 2 seconds."
      ],
      tips: [
        "Hammer curls build the brachialis muscle underneath the bicep, pushing the peak higher and adding arm thickness.",
        "Keep wrists locked straight."
      ],
      commonMistakes: [
        "Rotating wrists during the movement.",
        "Swinging body forward."
      ]
    },
    videoEmbedId: "zC3nLlEvin4",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-lat-raise",
    name: "Dumbbell Lateral Raise",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Lateral Deltoid (Side Shoulder)",
    secondaryMuscles: ["Supraspinatus", "Upper Trapezius"],
    instructions: {
      setup: "Stand with dumbbells at your sides, palms facing thighs, with a slight forward torso lean ~10 degrees.",
      execution: [
        "Raise dumbbells outward in the scapular plane until upper arms are parallel to the floor.",
        "Lead with your elbows and maintain a slight bend in your arms.",
        "Lower weights with a controlled 2-second eccentric phase."
      ],
      tips: [
        "Think of pouring water from a pitcher at the peak to keep side delts isolated.",
        "Avoid using heavy momentum."
      ],
      commonMistakes: [
        "Swinging the body and arching lower back.",
        "Shrugging shoulders up toward ears."
      ]
    },
    videoEmbedId: "3VcKaXpzqRo",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-db-rdl",
    name: "Dumbbell Romanian Deadlift",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Hamstrings & Gluteus Maximus",
    secondaryMuscles: ["Erector Spinae", "Forearms"],
    instructions: {
      setup: "Stand feet hip-width holding dumbbells in front of thighs with overhand grip and knees slightly unlocked.",
      execution: [
        "Push hips backward while lowering dumbbells close along thighs and shins.",
        "Descend until you feel a full stretch in hamstrings with flat spine.",
        "Drive hips forward and squeeze glutes to return to standing position."
      ],
      tips: [
        "Movement is a hip hinge, not a knee bend squat.",
        "Keep shoulder blades packed back."
      ],
      commonMistakes: [
        "Rounding the back.",
        "Bending knees too much."
      ]
    },
    videoEmbedId: "vB5OHsJ3EME",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-db-thruster",
    name: "Dumbbell Thrusters",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Shoulders",
    secondaryMuscles: ["Glutes", "Triceps", "Core"],
    instructions: {
      setup: "Hold dumbbells at shoulder height with palms facing inward, feet shoulder-width apart.",
      execution: [
        "Squat down until thighs are parallel to ground.",
        "Drive explosively up through your heels, using hip momentum to press dumbbells overhead into full lockout.",
        "Lower dumbbells back to shoulders as you transition into the next squat."
      ],
      tips: [
        "Combine the squat and overhead press into one fluid motion.",
        "Excellent high-intensity conditioning movement."
      ],
      commonMistakes: [
        "Pressing before hips fully extend.",
        "Collapsing chest forward during the squat."
      ]
    },
    videoEmbedId: "L219ltL15zk",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ E ] ═════════════════════ */
  {
    id: "lib-ez-preacher",
    name: "EZ-Bar Preacher Curl",
    bodyPart: "Arms",
    category: "Barbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii (Short Head)",
    secondaryMuscles: ["Brachialis", "Forearms"],
    instructions: {
      setup: "Sit at a preacher bench with upper arms resting flush against the pad. Grip the inner curves of an EZ-bar.",
      execution: [
        "Curl the bar upward until forearms are nearly vertical.",
        "Squeeze biceps firmly at the top contraction.",
        "Lower under slow control to full arm extension without hyper-extending elbows."
      ],
      tips: [
        "The preacher pad completely eliminates shoulder cheating and body momentum.",
        "Keep your armpits nestled against the top of the pad."
      ],
      commonMistakes: [
        "Lifting body off the seat to help pull weight.",
        "Dropping the bar too fast at the bottom."
      ]
    },
    videoEmbedId: "fIWP-FRFNU0",
    defaultBarWeightLbs: 25
  },
  {
    id: "lib-ez-skullcrusher",
    name: "EZ-Bar Skull Crusher",
    bodyPart: "Arms",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Triceps Brachii (Long & Lateral Heads)",
    secondaryMuscles: ["Anconeus", "Forearms"],
    instructions: {
      setup: "Lie on flat bench holding EZ-bar over chest with overhand grip and arms angled slightly back toward head.",
      execution: [
        "Bending only at elbows, lower the bar toward forehead or just beyond crown of head.",
        "Keep upper arms stationary and angled back to keep constant tricep tension.",
        "Extend forearms forcefully back to top lockout."
      ],
      tips: [
        "Angling upper arms slightly back prevents tricep tension loss at the top.",
        "Keep elbows tucked, not flared outward."
      ],
      commonMistakes: [
        "Letting elbows flare wide out.",
        "Moving upper arms back and forth like a pullover."
      ]
    },
    videoEmbedId: "d_KZxkY_0cM",
    defaultBarWeightLbs: 25
  },

  /* ═════════════════════ [ F ] ═════════════════════ */
  {
    id: "lib-face-pull",
    name: "Face Pull (Cable)",
    bodyPart: "Shoulders",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Rear Deltoids & Rotator Cuff",
    secondaryMuscles: ["Rhomboids", "Middle Trapezius", "Infraspinatus"],
    instructions: {
      setup: "Attach rope to cable pulley at upper chest / eye level. Grip rope with thumbs pointing backward.",
      execution: [
        "Pull rope directly toward your eye level / bridge of nose.",
        "Externally rotate hands back so knuckles face behind you at the peak.",
        "Squeeze rear delts and shoulder blades for 1 second, then control the return."
      ],
      tips: [
        "Essential postural exercise for shoulder health and rotator cuff longevity.",
        "Focus on external rotation at the end of the pull."
      ],
      commonMistakes: [
        "Pulling down toward chin without rotating wrists back.",
        "Using excessive weight and leaning back."
      ]
    },
    videoEmbedId: "rep-qVOkqgk",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-front-squat",
    name: "Front Squat (Barbell)",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Quadriceps & Core",
    secondaryMuscles: ["Glutes", "Upper Back", "Calves"],
    instructions: {
      setup: "Rack barbell on front deltoids with fingertips under bar (clean grip) or crossed arms. Keep elbows driven high.",
      execution: [
        "Inhale and brace core with chest proud and elbows up.",
        "Squat straight down between knees to full depth.",
        "Drive straight up through mid-foot while keeping elbows pointed forward."
      ],
      tips: [
        "High elbows keep the bar securely racked and prevent forward collapse.",
        "Targets the quadriceps with significantly less lumbar shear stress than back squats."
      ],
      commonMistakes: [
        "Dropping elbows down, causing the bar to slip off shoulders.",
        "Rounding upper thoracic spine."
      ]
    },
    videoEmbedId: "uYumuL_G_V0",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-farmers-walk",
    name: "Farmer's Walk",
    bodyPart: "Core",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Grip / Forearms & Core",
    secondaryMuscles: ["Trapezius", "Glutes", "Calves"],
    instructions: {
      setup: "Stand between two heavy dumbbells or trap bar. Deadlift weights up with chest tall and shoulders retracted.",
      execution: [
        "Walk forward in smooth, controlled short strides.",
        "Keep core braced and spine perfectly upright with no torso tilting.",
        "Turn around carefully or walk for measured distance / time."
      ],
      tips: [
        "Do not allow weights to bounce against your thighs.",
        "Builds total-body stability, forearm grip power, and trap size."
      ],
      commonMistakes: [
        "Slouching shoulders forward.",
        "Walking too fast and losing balance."
      ]
    },
    videoEmbedId: "Fkzk_RqlYig",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ G ] ═════════════════════ */
  {
    id: "lib-goblet-squat",
    name: "Goblet Squat",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Quadriceps & Gluteus Maximus",
    secondaryMuscles: ["Core", "Upper Back", "Calves"],
    instructions: {
      setup: "Hold a dumbbell or kettlebell vertically against your upper chest with both hands under the top bell, feet shoulder-width.",
      execution: [
        "Squat down by pushing knees outward and hips back, descending between knees.",
        "Keep elbows tracking inside knees at the bottom of the squat.",
        "Drive through mid-foot to stand back up."
      ],
      tips: [
        "Fantastic squat variation for beginners to learn upright torso positioning and hip mobility.",
        "Keep weight pressed against chest throughout."
      ],
      commonMistakes: [
        "Letting weight drift away from chest.",
        "Knees caving inward."
      ]
    },
    videoEmbedId: "MeIiIdhvXT4",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ H ] ═════════════════════ */
  {
    id: "lib-hack-squat",
    name: "Hack Squat (Machine)",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps (Vastus Lateralis & Medialis)",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    instructions: {
      setup: "Position back and shoulders firmly against pads on the machine. Place feet shoulder-width on the platform.",
      execution: [
        "Disengage safety handles and lower carriage until knees reach a 90-degree angle or full depth.",
        "Keep lower back flat against back pad throughout the descent.",
        "Drive through feet to return to top without locking knees violently."
      ],
      tips: [
        "Placing feet lower on platform emphasizes quads; placing feet higher recruits more glutes.",
        "Provides massive quad isolation with minimal spinal loading."
      ],
      commonMistakes: [
        "Lifting lower back off the pad at bottom of movement.",
        "Locking knees hard at top."
      ]
    },
    videoEmbedId: "0tn5K9NlCfo",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-hanging-leg-raise",
    name: "Hanging Leg Raise",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Rectus Abdominis & Hip Flexors",
    secondaryMuscles: ["Obliques", "Forearms / Grip"],
    instructions: {
      setup: "Hang from pull-up bar with overhand grip and active shoulders.",
      execution: [
        "Tilt pelvis posteriorly and raise legs upward until at least parallel to floor.",
        "Focus on rolling pelvis up toward ribcage rather than just swinging legs.",
        "Lower under controlled tempo without swinging."
      ],
      tips: [
        "Bend knees (hanging knee raise) if straight legs are too challenging.",
        "Pause briefly at peak contraction."
      ],
      commonMistakes: [
        "Using body swing momentum.",
        "Only flexing hips without curling pelvis to activate abs."
      ]
    },
    videoEmbedId: "hdng3Nm1x_E",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ I ] ═════════════════════ */
  {
    id: "lib-incline-barbell",
    name: "Incline Barbell Bench Press",
    bodyPart: "Chest",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Clavicular Head (Upper Chest)",
    secondaryMuscles: ["Anterior Deltoids", "Triceps Brachii"],
    instructions: {
      setup: "Set incline bench to 30 degrees. Lie back with eyes under bar, grip slightly wider than shoulder-width.",
      execution: [
        "Unrack bar and lower under control to your upper chest / clavicle area.",
        "Keep elbows tucked at ~45-degree angle.",
        "Press bar up and slightly backward to full arm lockout over eyes."
      ],
      tips: [
        "A 30-degree incline is optimal for upper chest; steeper angles shift workload to front delts.",
        "Keep shoulder blades pinned back."
      ],
      commonMistakes: [
        "Bouncing bar off upper sternum.",
        "Setting bench too steep (>45 degrees)."
      ]
    },
    videoEmbedId: "SrqOu55lrYU",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-incline-db",
    name: "Incline Dumbbell Press",
    bodyPart: "Chest",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Clavicular Head (Upper Chest)",
    secondaryMuscles: ["Anterior Deltoids", "Triceps Brachii"],
    instructions: {
      setup: "Set bench to 30-degree incline. Kick dumbbells up to shoulder height, palms facing forward.",
      execution: [
        "Press dumbbells upward and slightly inward over upper chest.",
        "Lower smoothly to full deep stretch across upper pectorals.",
        "Press back up without banging weights together."
      ],
      tips: [
        "Keep wrists vertically aligned over elbows.",
        "30-degree incline maximizes upper chest activation."
      ],
      commonMistakes: [
        "Flaring elbows too wide.",
        "Incline angle set too steep."
      ]
    },
    videoEmbedId: "8iPEnn-ltC8",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-incline-curl",
    name: "Incline Dumbbell Bicep Curl",
    bodyPart: "Arms",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii (Long Head)",
    secondaryMuscles: ["Brachialis", "Forearms"],
    instructions: {
      setup: "Lie back on 45–60 degree incline bench, letting arms hang straight down behind torso holding dumbbells.",
      execution: [
        "Curl weights upward while keeping upper arms pointed vertically down toward floor.",
        "Supinate wrists at top and squeeze peak bicep contraction.",
        "Lower under slow control for deep stretch on bicep long head."
      ],
      tips: [
        "The reclined angle places the long head of the biceps under loaded passive stretch.",
        "Do not swing upper arms forward during the curl."
      ],
      commonMistakes: [
        "Bringing elbows forward to assist with front delts.",
        "Using excessive weight."
      ]
    },
    videoEmbedId: "soxrZlIl35U",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ J ] ═════════════════════ */
  {
    id: "lib-jumping-lunges",
    name: "Jumping Lunges",
    bodyPart: "Legs",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Glutes",
    secondaryMuscles: ["Hamstrings", "Calves", "Core"],
    instructions: {
      setup: "Start in a forward lunge stance with both knees bent at 90 degrees.",
      execution: [
        "Explode upward off the ground, switching leg positions in mid-air.",
        "Land softly in the opposite lunge stance and immediately absorb into the next repetition.",
        "Alternate fluidly back and forth."
      ],
      tips: [
        "Land toe-to-heel softly to absorb impact through the muscles.",
        "Keep torso upright and chest open."
      ],
      commonMistakes: [
        "Slamming back knee into the floor.",
        "Landing with stiff knees."
      ]
    },
    videoEmbedId: "1ExU8CRmVKA",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ K ] ═════════════════════ */
  {
    id: "lib-kb-swing",
    name: "Kettlebell Swing",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Glutes & Hamstrings",
    secondaryMuscles: ["Core", "Erector Spinae", "Shoulders"],
    instructions: {
      setup: "Stand with feet slightly wider than shoulder-width, holding kettlebell with both hands in front of hips.",
      execution: [
        "Hinge at hips, pushing them back while swinging kettlebell between legs.",
        "Snap hips forward explosively, standing tall and projecting kettlebell to chest/eye level.",
        "Let kettlebell float up weightlessly, then guide it back into the next hinge."
      ],
      tips: [
        "Power comes from the hip thrust snap, NOT by lifting with your arms.",
        "Keep arms relaxed like ropes."
      ],
      commonMistakes: [
        "Squatting instead of hinging at the hips.",
        "Using shoulders and arms to muscle the weight up."
      ]
    },
    videoEmbedId: "YSxHifyI6s8",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-kneeling-cable-crunch",
    name: "Kneeling Cable Crunch",
    bodyPart: "Core",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Rectus Abdominis",
    secondaryMuscles: ["Obliques", "Serratus"],
    instructions: {
      setup: "Attach rope to high pulley. Kneel facing machine, holding rope handles beside your ears/cheeks.",
      execution: [
        "Flex your spine and curl ribcage down toward pelvis, pulling elbows toward thighs.",
        "Contract abs hard at the bottom for 1 second.",
        "Slowly extend spine back upward without moving hips."
      ],
      tips: [
        "Keep hips stationary throughout; the movement must come from spinal flexion (curling your back).",
        "Do not sit back on your heels."
      ],
      commonMistakes: [
        "Moving hips back and forth like a bow.",
        "Pulling with arms instead of crunching with abs."
      ]
    },
    videoEmbedId: "2fOCObCnb_M",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ L ] ═════════════════════ */
  {
    id: "lib-lat-pulldown",
    name: "Lat Pulldown (Cable)",
    bodyPart: "Back",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Latissimus Dorsi",
    secondaryMuscles: ["Biceps Brachii", "Rhomboids", "Middle Trapezius"],
    instructions: {
      setup: "Sit at lat pulldown station with thighs secured under pads. Grip wide bar with overhand grip wider than shoulders.",
      execution: [
        "Pull your shoulder blades down and pull bar smoothly to upper chest.",
        "Drive elbows down and back, squeezing lats at the bottom point.",
        "Control the bar back up to full stretch overhead."
      ],
      tips: [
        "Lean back only slightly (~10–15 degrees) for optimal lat recruitment.",
        "Think of driving elbows to your back pockets."
      ],
      commonMistakes: [
        "Leaning back excessively to turn it into a row.",
        "Pulling bar behind neck."
      ]
    },
    videoEmbedId: "CAwf7n6Luuc",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-leg-extension",
    name: "Leg Extension (Machine)",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Quadriceps (Rectus Femoris)",
    secondaryMuscles: ["Vastus Medialis", "Vastus Lateralis"],
    instructions: {
      setup: "Adjust machine pad to sit against lower shins just above ankles, knees aligned with machine pivot point.",
      execution: [
        "Extend knees to lift weight until legs are nearly straight.",
        "Squeeze quadriceps firmly at full extension.",
        "Lower the weight slowly under 2-second control."
      ],
      tips: [
        "Keep your hips pinned to the seat using the side handles.",
        "Directly isolates and burns out the quadriceps."
      ],
      commonMistakes: [
        "Kicking legs explosively with momentum.",
        "Lifting buttocks off the seat."
      ]
    },
    videoEmbedId: "YyvSfVjQeL0",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-leg-press",
    name: "Leg Press (45-Degree)",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Calves"],
    instructions: {
      setup: "Sit with lower back flat against pad. Place feet shoulder-width on footplate.",
      execution: [
        "Release safety bars and lower sled until knees form roughly a 90-degree angle.",
        "Press through mid-foot to push sled back up.",
        "Stop just short of locking knees at the top."
      ],
      tips: [
        "Never let your lower back curl or lift off the seat pad at the bottom.",
        "Do not lock out knees rigidly."
      ],
      commonMistakes: [
        "Lowering sled so far that pelvis tucks and lower back rounds.",
        "Placing hands on knees."
      ]
    },
    videoEmbedId: "IZxyjW7MPJQ",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-lying-leg-curl",
    name: "Lying Hamstring Leg Curl",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Hamstrings (Biceps Femoris, Semitendinosus)",
    secondaryMuscles: ["Gastrocnemius (Calves)"],
    instructions: {
      setup: "Lie face down on machine with padded lever positioned just below calf muscles on Achilles tendon.",
      execution: [
        "Curl legs upward toward glutes as far as possible.",
        "Squeeze hamstrings for 1 second at full contraction.",
        "Lower under controlled eccentric tempo back to starting position."
      ],
      tips: [
        "Keep hips pressed firmly into the bench throughout the curl.",
        "Dorsiflex ankles (toes pointed toward shins) for optimal hamstring focus."
      ],
      commonMistakes: [
        "Arching lower back and lifting hips to help curl weight.",
        "Dropping weight quickly on eccentric."
      ]
    },
    videoEmbedId: "1Tq3QdYUuHs",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ M ] ═════════════════════ */
  {
    id: "lib-mountain-climbers",
    name: "Mountain Climbers",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Rectus Abdominis & Hip Flexors",
    secondaryMuscles: ["Shoulders", "Quadriceps", "Chest"],
    instructions: {
      setup: "Assume high push-up plank position with hands under shoulders and body in straight line.",
      execution: [
        "Drive one knee forward toward your chest rapidly.",
        "Quickly switch legs, extending first leg back while driving opposite knee forward.",
        "Maintain a steady, rhythmic sprinting pace while keeping hips level."
      ],
      tips: [
        "Keep shoulders over wrists and avoid letting hips bounce up into the air.",
        "Great for conditioning and core endurance."
      ],
      commonMistakes: [
        "Hips piked high in the air.",
        "Bouncing weight onto the toes."
      ]
    },
    videoEmbedId: "nmwgirgXLYM",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ O ] ═════════════════════ */
  {
    id: "lib-ohp",
    name: "Overhead Barbell Press (Military Press)",
    bodyPart: "Shoulders",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Anterior & Lateral Deltoids",
    secondaryMuscles: ["Triceps Brachii", "Upper Pectorals", "Upper Traps", "Core"],
    instructions: {
      setup: "Unrack bar at collarbone level with hands just outside shoulders. Stand tall with abs and glutes squeezed tight.",
      execution: [
        "Tilt head back slightly to clear chin as you press bar vertically.",
        "Press bar overhead until arms are locked out.",
        "Push head through 'window' created by arms at top."
      ],
      tips: [
        "Squeeze glutes hard to protect lumbar spine from overarching.",
        "Keep forearms vertical directly beneath the bar."
      ],
      commonMistakes: [
        "Using leg dip (push press).",
        "Overarching lower back."
      ]
    },
    videoEmbedId: "2yjwXTZQDDI",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-one-arm-row",
    name: "One-Arm Dumbbell Row",
    bodyPart: "Back",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Latissimus Dorsi & Rhomboids",
    secondaryMuscles: ["Biceps", "Rear Delts", "Forearms"],
    instructions: {
      setup: "Place one knee and hand on flat bench for support. Hold dumbbell in free hand with arm hanging straight down.",
      execution: [
        "Pull dumbbell up toward hip / lower ribcage, leading with elbow.",
        "Squeeze back muscles firmly at top.",
        "Lower dumbbell under control to full stretch at bottom."
      ],
      tips: [
        "Keep torso parallel to bench without rotating shoulders excessively.",
        "Pull toward hip rather than straight up to chest."
      ],
      commonMistakes: [
        "Twisting torso to yank weight up.",
        "Rounding spine."
      ]
    },
    videoEmbedId: "pYcpY20QaE8",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-overhead-cable-tricep",
    name: "Overhead Cable Tricep Extension",
    bodyPart: "Arms",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Triceps Brachii (Long Head)",
    secondaryMuscles: ["Anconeus"],
    instructions: {
      setup: "Attach rope to low or mid cable pulley. Turn away from machine, hold rope behind head with elbows pointing forward.",
      execution: [
        "Extend forearms forward and overhead until arms are straight.",
        "Spread rope apart at full extension for peak tricep contraction.",
        "Lower rope slowly behind head for deep stretch on the long head."
      ],
      tips: [
        "Overhead position maximally stretches the long head of the triceps.",
        "Keep upper arms stationary next to head."
      ],
      commonMistakes: [
        "Flaring elbows wide open.",
        "Using torso momentum to heave the cable."
      ]
    },
    videoEmbedId: "ns-RgSbDu0A",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ P ] ═════════════════════ */
  {
    id: "lib-pec-deck",
    name: "Pec Deck Fly (Machine)",
    bodyPart: "Chest",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Pectoralis Major (Sternal Head)",
    secondaryMuscles: ["Anterior Deltoids"],
    instructions: {
      setup: "Adjust seat height so handles align with mid-chest. Sit with back flat against pad and grip levers.",
      execution: [
        "Bring handles together in front of chest in a smooth arc.",
        "Squeeze pectorals hard at peak point for 1 second.",
        "Allow arms to open back slowly to stretch pectorals."
      ],
      tips: [
        "Keep elbows slightly bent and fixed throughout.",
        "Great safe finisher for chest hypertrophy."
      ],
      commonMistakes: [
        "Allowing shoulders to roll forward.",
        "Setting seat too low or high."
      ]
    },
    videoEmbedId: "O-2Vw_t3N7E",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-plank",
    name: "Plank (Forearm)",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Transverse Abdominis & Rectus Abdominis",
    secondaryMuscles: ["Glutes", "Shoulders", "Lower Back"],
    instructions: {
      setup: "Place forearms on floor with elbows directly under shoulders, legs extended back with toes on floor.",
      execution: [
        "Lift body into a rigid straight line from head to heels.",
        "Squeeze glutes, pull belly button into spine, and hold tension.",
        "Breathe steadily without letting hips sag or pike."
      ],
      tips: [
        "Actively pull elbows toward toes to generate maximum abdominal tension.",
        "Focus on quality isometric tension over pure duration."
      ],
      commonMistakes: [
        "Hips sagging down toward floor (strains lower back).",
        "Piking hips in the air."
      ]
    },
    videoEmbedId: "ASdvN_XEl_c",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-pullups",
    name: "Pull-Ups (Overhand)",
    bodyPart: "Back",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Latissimus Dorsi",
    secondaryMuscles: ["Biceps Brachii", "Rhomboids", "Teres Major", "Forearms"],
    instructions: {
      setup: "Grip pull-up bar with overhand grip wider than shoulders. Hang at full extension.",
      execution: [
        "Depress scapula by pulling shoulder blades down.",
        "Drive elbows down toward hips to pull chin over bar.",
        "Lower under complete control back to a dead hang."
      ],
      tips: [
        "Keep chest driven upward toward the bar.",
        "Cross ankles and squeeze glutes to stop swing."
      ],
      commonMistakes: [
        "Kicking legs to kip up.",
        "Cutting range of motion short."
      ]
    },
    videoEmbedId: "eGo4IYlbE5g",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-pushups",
    name: "Push-Ups",
    bodyPart: "Chest",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Pectoralis Major & Triceps",
    secondaryMuscles: ["Anterior Deltoids", "Core"],
    instructions: {
      setup: "Place hands slightly wider than shoulder-width, body in a rigid plank from head to heels.",
      execution: [
        "Lower body under control until chest is 1 inch from floor, elbows at ~45 degrees.",
        "Press through palms to return to top position with core tight.",
        "Repeat with consistent tempo."
      ],
      tips: [
        "Keep your core and glutes engaged to maintain a rigid plank.",
        "Elevate hands on a bench to regress, or feet on a bench to progress."
      ],
      commonMistakes: [
        "Flaring elbows at 90 degrees.",
        "Hips sagging down."
      ]
    },
    videoEmbedId: "IODxDxX7oi4",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ R ] ═════════════════════ */
  {
    id: "lib-rear-delt-fly",
    name: "Rear Delt Dumbbell Fly",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Posterior Deltoid",
    secondaryMuscles: ["Infraspinatus", "Rhomboids", "Trapezius"],
    instructions: {
      setup: "Hinge at hips with a flat back (or lie chest-down on incline bench). Hold dumbbells hanging down with slight elbow bend.",
      execution: [
        "Raise dumbbells out to sides in a wide arc until elbows reach shoulder level.",
        "Squeeze rear deltoids firmly at the top.",
        "Lower dumbbells under slow control."
      ],
      tips: [
        "Keep pinkies higher than thumbs to isolate the posterior deltoid.",
        "Do not use heavy weights that compromise strict form."
      ],
      commonMistakes: [
        "Using back momentum to fling weights.",
        "Shrugging traps instead of using rear delts."
      ]
    },
    videoEmbedId: "yN6Q13_6Zmw",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-rdl-barbell",
    name: "Romanian Deadlift (Barbell RDL)",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Hamstrings & Gluteus Maximus",
    secondaryMuscles: ["Erector Spinae", "Latissimus Dorsi", "Forearms"],
    instructions: {
      setup: "Stand holding barbell with overhand shoulder-width grip, feet hip-width, knees slightly unlocked.",
      execution: [
        "Hinge at hips, pushing them backward while lowering bar down shins.",
        "Keep bar in close contact with legs and back straight.",
        "When you feel maximum hamstring stretch, drive hips forward to stand."
      ],
      tips: [
        "Think of trying to touch a wall behind you with your glutes.",
        "Movement is horizontal hip displacement, not vertical squatting."
      ],
      commonMistakes: [
        "Rounding the lower back.",
        "Bending knees excessively."
      ]
    },
    videoEmbedId: "JCXUYuzwNrM",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-russian-twists",
    name: "Russian Twists",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Internal & External Obliques",
    secondaryMuscles: ["Rectus Abdominis", "Hip Flexors"],
    instructions: {
      setup: "Sit on floor with knees bent, lean torso back 45 degrees, and elevate feet slightly off floor.",
      execution: [
        "Rotate torso side to side, bringing hands / weight to touch floor beside hips.",
        "Keep chest open and core braced tight.",
        "Alternate sides smoothly with control."
      ],
      tips: [
        "Rotate with your shoulders and ribs, not just waving arms.",
        "Hold a dumbbell or plate for added resistance."
      ],
      commonMistakes: [
        "Moving only arms without rotating torso.",
        "Rounding spine excessively."
      ]
    },
    videoEmbedId: "wkD8rjkodUI",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ S ] ═════════════════════ */
  {
    id: "lib-seated-cable-row",
    name: "Seated Cable Row",
    bodyPart: "Back",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Middle Trapezius & Rhomboids",
    secondaryMuscles: ["Latissimus Dorsi", "Biceps", "Erector Spinae"],
    instructions: {
      setup: "Sit on row bench with feet on footrests and knees slightly bent. Grip V-bar handle with arms extended.",
      execution: [
        "Sit upright with chest proud and spine neutral.",
        "Pull handle into abdomen while driving elbows backward.",
        "Squeeze shoulder blades together for 1 second, then control return to stretch."
      ],
      tips: [
        "Do not swing back and forth excessively.",
        "Keep shoulders down away from ears."
      ],
      commonMistakes: [
        "Rocking torso backward to heave weight.",
        "Rounding back on stretch."
      ]
    },
    videoEmbedId: "GZbfZ033fbo",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-seated-db-press",
    name: "Seated Dumbbell Shoulder Press",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Anterior & Lateral Deltoids",
    secondaryMuscles: ["Triceps Brachii", "Upper Traps"],
    instructions: {
      setup: "Sit on upright bench with dumbbells at shoulder height, palms facing forward.",
      execution: [
        "Press dumbbells upward in an arc until arms are extended overhead.",
        "Lower under steady control until dumbbells reach ear/chin level.",
        "Repeat without clanking weights at the top."
      ],
      tips: [
        "Keep elbows angled slightly forward in scapular plane (~30 degrees).",
        "Maintain back contact with bench pad."
      ],
      commonMistakes: [
        "Overarching lower back off the pad.",
        "Short-changing range of motion at bottom."
      ]
    },
    videoEmbedId: "qEwKCR5JCog",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-seated-hamstring",
    name: "Seated Hamstring Curl",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["Calves"],
    instructions: {
      setup: "Sit on machine with thigh pad secured over lower thighs and ankle pad positioned behind lower calves.",
      execution: [
        "Curl legs downward and backward under the seat as far as possible.",
        "Squeeze hamstrings intensely at peak contraction.",
        "Control the weight back up slowly to a full stretch."
      ],
      tips: [
        "The seated position places the hamstrings under greater stretch at the hip, yielding superior hypertrophy.",
        "Hold seat handles to lock hips down."
      ],
      commonMistakes: [
        "Letting knees slide out from under pad.",
        "Releasing weight too quickly."
      ]
    },
    videoEmbedId: "OrxowestMQk",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-standing-calf",
    name: "Standing Calf Raise",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Gastrocnemius (Calf Muscle)",
    secondaryMuscles: ["Soleus", "Tibialis Posterior"],
    instructions: {
      setup: "Place balls of feet on block with heels hanging off. Position shoulder pads on machine with knees straight.",
      execution: [
        "Lower heels deeply below the platform level for a full calf stretch.",
        "Drive through balls of feet and elevate heels as high as possible onto tiptoes.",
        "Pause for 1 second at top contraction."
      ],
      tips: [
        "A full stretch at bottom and 1-second pause at top triggers maximum calf growth.",
        "Do not bounce using Achilles tendon spring."
      ],
      commonMistakes: [
        "Bouncing rapidly with zero stretch.",
        "Bending knees."
      ]
    },
    videoEmbedId: "YMmgqO8Jo-k",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-sumo-deadlift",
    name: "Sumo Deadlift",
    bodyPart: "Back",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Glutes, Adductors & Hamstrings",
    secondaryMuscles: ["Quadriceps", "Erector Spinae", "Traps"],
    instructions: {
      setup: "Stand with wide stance (toes pointing out ~45 degrees). Grip bar inside knees with arms straight down.",
      execution: [
        "Drop hips into position with chest tall and knees pushed wide open.",
        "Drive floor apart with feet while extending hips and knees together.",
        "Lock out hips by squeezing glutes forward."
      ],
      tips: [
        "Keep torso significantly more upright than in conventional deadlifts.",
        "Push knees outward in line with toes throughout."
      ],
      commonMistakes: [
        "Hips shooting up first before bar leaves floor.",
        "Knees caving inward."
      ]
    },
    videoEmbedId: "wQ2Evyxbpsg",
    defaultBarWeightLbs: 45
  },

  /* ═════════════════════ [ T ] ═════════════════════ */
  {
    id: "lib-tbar-row",
    name: "T-Bar Row",
    bodyPart: "Back",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Middle Trapezius, Rhomboids & Lats",
    secondaryMuscles: ["Biceps", "Erector Spinae", "Rear Delts"],
    instructions: {
      setup: "Straddle T-bar with feet hip-width. Hinge forward 45 degrees and grip handles with neutral grip.",
      execution: [
        "Pull handles up toward chest/abdomen, retracting shoulder blades.",
        "Squeeze back muscles hard at top of row.",
        "Lower weight under control to full arm extension."
      ],
      tips: [
        "Keep chest proud and back flat throughout.",
        "Use smaller diameter plates (25s) to allow a greater range of motion."
      ],
      commonMistakes: [
        "Standing too upright.",
        "Rounding lumbar spine."
      ]
    },
    videoEmbedId: "j3Igk5nyZE4",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-tricep-pushdown",
    name: "Tricep Rope Pushdown",
    bodyPart: "Arms",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Triceps Brachii (Lateral & Medial Heads)",
    secondaryMuscles: ["Anconeus"],
    instructions: {
      setup: "Attach double rope to high pulley. Grip rope with palms facing each other, elbows pinned at sides.",
      execution: [
        "Extend forearms down until arms are fully straight.",
        "Spread rope ends apart at bottom for peak tricep contraction.",
        "Return upward with control to 90 degrees."
      ],
      tips: [
        "Keep upper arms pinned to your sides with zero swinging.",
        "Lean forward slightly from hips for balance."
      ],
      commonMistakes: [
        "Allowing elbows to drift forward and back.",
        "Using body weight to press down."
      ]
    },
    videoEmbedId: "vB5OHsJ3EME",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-tricep-dips",
    name: "Tricep Dips (Bodyweight)",
    bodyPart: "Arms",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Triceps Brachii",
    secondaryMuscles: ["Anterior Deltoids", "Pectorals"],
    instructions: {
      setup: "Mount parallel bars with arms locked straight and torso held strictly vertical.",
      execution: [
        "Lower body by bending elbows while keeping torso upright and elbows tucked close to body.",
        "Descend until elbows reach 90 degrees.",
        "Press through palms to full arm lockout."
      ],
      tips: [
        "An upright torso isolates triceps; leaning forward shifts load to chest.",
        "Keep elbows pointed backward, not flared outward."
      ],
      commonMistakes: [
        "Flaring elbows wide.",
        "Descending too deep past shoulder comfort."
      ]
    },
    videoEmbedId: "6kALZikXxLc",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ U ] ═════════════════════ */
  {
    id: "lib-upright-row",
    name: "Upright Barbell Row",
    bodyPart: "Shoulders",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Lateral Deltoids & Upper Trapezius",
    secondaryMuscles: ["Biceps", "Forearms"],
    instructions: {
      setup: "Stand holding barbell with overhand grip at shoulder-width (not too narrow).",
      execution: [
        "Pull bar vertically along torso, leading with elbows until they reach shoulder height.",
        "Pause briefly at peak point.",
        "Lower under control back to thighs."
      ],
      tips: [
        "Use a shoulder-width grip (narrow grip can cause shoulder impingement).",
        "Stop pull when elbows reach shoulder level."
      ],
      commonMistakes: [
        "Gripping too narrow with hands touching.",
        "Lifting elbows way above shoulder plane."
      ]
    },
    videoEmbedId: "amCU-ziHITM",
    defaultBarWeightLbs: 45
  },

  /* ═════════════════════ [ V ] ═════════════════════ */
  {
    id: "lib-v-up",
    name: "V-Ups (Core)",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Rectus Abdominis",
    secondaryMuscles: ["Hip Flexors", "Obliques"],
    instructions: {
      setup: "Lie flat on back with arms extended overhead and legs straight together.",
      execution: [
        "Simultaneously lift legs and torso into air, reaching hands to touch toes in a 'V' shape.",
        "Balance on tailbone at peak contraction.",
        "Lower slowly back to floor without letting lower back arch."
      ],
      tips: [
        "Keep legs and arms as straight as possible.",
        "Exhale forcefully on the crunch."
      ],
      commonMistakes: [
        "Bending knees excessively.",
        "Jerking neck forward."
      ]
    },
    videoEmbedId: "7UVgs18Y1P4",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ W ] ═════════════════════ */
  {
    id: "lib-walking-lunges",
    name: "Walking Dumbbell Lunges",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Calves", "Core"],
    instructions: {
      setup: "Stand holding dumbbells at sides. Keep chest tall and shoulders back.",
      execution: [
        "Step forward into a lunge, lowering back knee to hover 1 inch above floor.",
        "Drive through front heel to step directly forward into the next lunge with opposite leg.",
        "Continue walking continuously forward."
      ],
      tips: [
        "Maintain upright torso posture throughout.",
        "Take controlled, consistent stride lengths."
      ],
      commonMistakes: [
        "Slamming back knee onto floor.",
        "Torso collapsing forward."
      ]
    },
    videoEmbedId: "L8fvypPrzzs",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-wrist-curl",
    name: "Wrist Curls (Forearms)",
    bodyPart: "Arms",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Forearm Flexors",
    secondaryMuscles: ["Grip Strength"],
    instructions: {
      setup: "Sit on bench with forearms resting on thighs, wrists hanging off knees holding dumbbells palms up.",
      execution: [
        "Lower weights by extending wrists downward.",
        "Curl wrists upward as high as possible, squeezing forearm flexors.",
        "Lower under control."
      ],
      tips: [
        "Allow dumbbells to roll down to fingertips at bottom for full stretch.",
        "Builds forearm thickness and grip endurance."
      ],
      commonMistakes: [
        "Using arm and shoulder momentum.",
        "Rushing repetitions."
      ]
    },
    videoEmbedId: "FWJR5Ve8gkQ",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ Z ] ═════════════════════ */
  {
    id: "lib-z-press",
    name: "Z-Press (Seated Floor Press)",
    bodyPart: "Shoulders",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Anterior & Lateral Deltoids",
    secondaryMuscles: ["Core", "Upper Back", "Triceps"],
    instructions: {
      setup: "Sit flat on floor with legs spread in 'V' shape, holding barbell at collarbone level with no back support.",
      execution: [
        "Brace core tight and press barbell straight overhead to full lockout.",
        "Push head slightly forward at top.",
        "Lower under strict control back to collarbones without leaning back."
      ],
      tips: [
        "Sitting on the floor completely removes leg drive and forces absolute core stability and strict shoulder power.",
        "Keep spine rigidly vertical throughout."
      ],
      commonMistakes: [
        "Leaning backward to compensate for shoulder weakness.",
        "Bending knees."
      ]
    },
    videoEmbedId: "y1fLzW5Lz_U",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-zottman-curl",
    name: "Zottman Curls",
    bodyPart: "Arms",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Biceps Brachii & Brachioradialis",
    secondaryMuscles: ["Forearm Extensors", "Brachialis"],
    instructions: {
      setup: "Stand tall holding dumbbells with palms facing forward (underhand grip).",
      execution: [
        "Curl weights up with underhand grip like a standard bicep curl.",
        "At top of curl, rotate wrists 180 degrees so palms face downward (overhand grip).",
        "Lower weights slowly in overhand position to blast the forearm brachioradialis.",
        "Rotate back to palms-up at bottom and repeat."
      ],
      tips: [
        "Combines concentric bicep loading with eccentric forearm overload in one exercise.",
        "Perform with strict tempo."
      ],
      commonMistakes: [
        "Rotating wrists during the lift instead of at the top.",
        "Dropping weights quickly."
      ]
    },
    videoEmbedId: "ZrpRBgntHsU",
    defaultBarWeightLbs: 0
  }
];
