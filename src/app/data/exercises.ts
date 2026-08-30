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
      setup: "Kneel on a soft mat with knees hip-width apart, holding ab wheel handles directly under shoulders.",
      execution: [
        "Brace core tight and tilt pelvis slightly posterior to flatten lower back.",
        "Roll wheel forward in a controlled straight line until body is nearly parallel to floor.",
        "Squeeze abdominals and pull hips and wheel back toward knees to return."
      ],
      tips: [
        "Never let your lower back sag into hyperextension.",
        "Pull with your abdominals, not by sitting back onto heels."
      ],
      commonMistakes: [
        "Arching lower back at full extension.",
        "Initiating return with hips first."
      ]
    },
    videoEmbedId: "rqiTPdK1cWg",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-arnold-press",
    name: "Arnold Press",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Anterior & Lateral Deltoids",
    secondaryMuscles: ["Triceps Brachii", "Upper Trapezius", "Rotator Cuff"],
    instructions: {
      setup: "Sit on upright bench holding dumbbells at collarbone level with palms facing chest.",
      execution: [
        "Press dumbbells overhead while rotating wrists outward 180 degrees.",
        "At top of press, palms should face forward with arms fully extended.",
        "Reverse rotational motion smoothly as you lower weights back to start."
      ],
      tips: [
        "Keep rotation fluid and continuous throughout the pressing ascent.",
        "Avoid clanking dumbbells together at top."
      ],
      commonMistakes: [
        "Rotating prematurely before clearing shoulder level.",
        "Using excessive torso momentum."
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
      setup: "Set counterbalance weight pin. Place knees on padded platform and grip overhand handles.",
      execution: [
        "Depress shoulder blades and pull chest upward toward bar.",
        "Drive elbows toward hips until chin clears bar.",
        "Lower under steady control until arms are fully extended."
      ],
      tips: [
        "Progressively reduce counterweight as your pulling strength increases.",
        "Keep core braced to avoid swinging on platform."
      ],
      commonMistakes: [
        "Relying solely on arms without engaging back.",
        "Dropping down rapidly without eccentric control."
      ]
    },
    videoEmbedId: "81smqN1b90E",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-australian-pullup",
    name: "Australian Pull-Up (Inverted Row)",
    bodyPart: "Back",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Rhomboids & Middle Trapezius",
    secondaryMuscles: ["Latissimus Dorsi", "Biceps", "Core"],
    instructions: {
      setup: "Set a barbell on a rack at waist height. Hang underneath bar with heels on floor and body in rigid straight plank.",
      execution: [
        "Pull chest up to touch the bar by driving elbows backward and retracting shoulder blades.",
        "Squeeze upper back firmly for 1 second.",
        "Lower under control until arms are fully extended."
      ],
      tips: [
        "Keep glutes and abs squeezed tight to maintain a straight line from heels to head.",
        "Adjust bar height higher to make it easier, or elevate feet on a box to increase difficulty."
      ],
      commonMistakes: [
        "Hips sagging down toward floor.",
        "Reaching with chin instead of pulling with back."
      ]
    },
    videoEmbedId: "XZV9IwluPjw",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ B ] ═════════════════════ */
  {
    id: "lib-back-squat",
    name: "Back Squat",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Quadriceps & Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Erector Spinae", "Core & Calves"],
    instructions: {
      setup: "Position bar on upper traps (high bar) or rear delts (low bar). Stand with feet shoulder-width apart, toes turned outward ~15–30 degrees.",
      execution: [
        "Brace core with a deep breath into your abdominal wall.",
        "Hinge hips and knees simultaneously, descending until hip crease is below top of knees.",
        "Drive forcefully through mid-foot to stand back up, driving knees outward."
      ],
      tips: [
        "Keep chest upright and maintain neutral spine throughout descent.",
        "Press knees out in line with toes during ascent."
      ],
      commonMistakes: [
        "Knees caving inward (valgus collapse).",
        "Rounding lower back at bottom of squat."
      ]
    },
    videoEmbedId: "bEv6CCg2BC8",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-bench-press",
    name: "Bench Press",
    bodyPart: "Chest",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Pectoralis Major (Mid & Lower Chest)",
    secondaryMuscles: ["Anterior Deltoids", "Triceps Brachii", "Serratus Anterior"],
    instructions: {
      setup: "Lie flat on bench with eyes under bar. Plant feet firmly on floor. Grip bar slightly wider than shoulder-width and retract shoulder blades.",
      execution: [
        "Unrack bar and stabilize it directly over chest with locked elbows.",
        "Inhale and lower bar under control until it lightly touches mid-sternum, keeping elbows at ~45 degrees.",
        "Drive through feet and press bar back up forcefully to full lockout."
      ],
      tips: [
        "Maintain a slight natural arch in lower back with glutes pinned to bench.",
        "Think of bending bar into a U-shape to pack lats."
      ],
      commonMistakes: [
        "Bouncing bar off sternum.",
        "Flaring elbows straight out at 90 degrees."
      ]
    },
    videoEmbedId: "rT7DgCr-3pg",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-bent-over-row",
    name: "Bent-Over Row",
    bodyPart: "Back",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Latissimus Dorsi & Rhomboids",
    secondaryMuscles: ["Trapezius", "Posterior Deltoids", "Biceps", "Lower Back"],
    instructions: {
      setup: "Stand with feet hip-width holding bar with overhand grip. Hinge forward at hips to roughly 45 degrees with flat back.",
      execution: [
        "Pull barbell up toward lower ribcage/navel, driving elbows backward.",
        "Squeeze shoulder blades together hard at top contraction.",
        "Lower bar smoothly until arms are fully extended."
      ],
      tips: [
        "Keep knees slightly bent to relieve hamstring tension.",
        "Do not bounce upper body up and down to create false momentum."
      ],
      commonMistakes: [
        "Rounding lower back.",
        "Standing too upright."
      ]
    },
    videoEmbedId: "FWJR5Ve8gkQ",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-bicep-curl",
    name: "Bicep Curl",
    bodyPart: "Arms",
    category: "Barbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii",
    secondaryMuscles: ["Brachialis", "Brachioradialis", "Forearms"],
    instructions: {
      setup: "Stand tall holding bar with underhand grip at shoulder-width, elbows pinned to sides.",
      execution: [
        "Curl bar upward toward upper chest, contracting biceps fully.",
        "Pause and squeeze biceps at peak point.",
        "Lower bar under control with a steady 2-second eccentric phase."
      ],
      tips: [
        "Keep torso completely stationary without swinging hips.",
        "Use an EZ-bar if straight bar causes wrist discomfort."
      ],
      commonMistakes: [
        "Swinging lower back to kickstart weight.",
        "Flaring elbows forward excessively."
      ]
    },
    videoEmbedId: "kwG2ipFRgfo",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-box-jump",
    name: "Box Jumps",
    bodyPart: "Legs",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Quadriceps & Glutes",
    secondaryMuscles: ["Calves", "Hamstrings", "Core"],
    instructions: {
      setup: "Stand facing a sturdy plyo box, feet hip-width apart.",
      execution: [
        "Swing arms back and hinge hips into a quarter-squat position.",
        "Explode upward, driving arms forward to jump cleanly onto top of box.",
        "Land softly in a partial squat with knees bent to absorb impact.",
        "Step down one foot at a time to protect Achilles tendons."
      ],
      tips: [
        "Land like a ninja — virtually silent landings protect knees and joints.",
        "Step down rather than jumping backward off box."
      ],
      commonMistakes: [
        "Landing with stiff, locked knees.",
        "Choosing a box too high and compromising landing mechanics."
      ]
    },
    videoEmbedId: "52r_Ul5k03g",
    defaultBarWeightLbs: 0
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
      setup: "Stand 2–3 feet in front of a bench. Elevate one foot on bench behind you. Hold dumbbells at sides.",
      execution: [
        "Lower hips down and slightly back until front thigh is parallel to ground.",
        "Keep front shin vertical and torso slightly hinged forward for glute focus.",
        "Drive through front heel to return to top position."
      ],
      tips: [
        "85% of weight should be on front leg; back leg is only for balance.",
        "Keep hips square to front."
      ],
      commonMistakes: [
        "Pushing off rear foot instead of front heel.",
        "Front knee caving inward."
      ]
    },
    videoEmbedId: "2C-uNgKwPLE",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ C ] ═════════════════════ */
  {
    id: "lib-cable-crunch",
    name: "Cable Crunch",
    bodyPart: "Core",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Rectus Abdominis",
    secondaryMuscles: ["Obliques", "Serratus Anterior"],
    instructions: {
      setup: "Attach rope to high cable pulley. Kneel facing machine holding rope ends beside ears.",
      execution: [
        "Flex spine and curl ribcage down toward pelvis, bringing elbows toward thighs.",
        "Contract abs hard at bottom for 1 second.",
        "Slowly extend spine back upward without moving hips."
      ],
      tips: [
        "Keep hips stationary; the movement must come from curling your spine.",
        "Do not sit back onto your heels."
      ],
      commonMistakes: [
        "Hinging at hips instead of curling spine.",
        "Pulling with arms."
      ]
    },
    videoEmbedId: "2fOCObCnb_M",
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
      setup: "Mount parallel dip bars with arms straight. Lean torso forward ~30 degrees and cross ankles.",
      execution: [
        "Lower body by bending elbows until upper arms are parallel to floor.",
        "Flare elbows out slightly to target chest pectorals.",
        "Press forcefully through palms back to top lockout."
      ],
      tips: [
        "Forward torso lean shifts emphasis from triceps to lower chest.",
        "Add a weight belt once bodyweight dips become comfortable."
      ],
      commonMistakes: [
        "Staying completely upright (isolates triceps).",
        "Descending too deep past shoulder comfort."
      ]
    },
    videoEmbedId: "2z8JmcrW-As",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-chest-fly",
    name: "Chest Fly",
    bodyPart: "Chest",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Pectoralis Major (Mid Chest)",
    secondaryMuscles: ["Anterior Deltoids", "Biceps Short Head"],
    instructions: {
      setup: "Lie on flat bench holding dumbbells over chest with palms facing each other and slight elbow bend.",
      execution: [
        "Lower dumbbells outward in a wide lateral arc until feeling deep chest stretch.",
        "Maintain fixed elbow bend throughout descent.",
        "Bring dumbbells back together over chest as if hugging a barrel."
      ],
      tips: [
        "Do not over-stretch beyond normal shoulder flexibility.",
        "Focus on chest squeeze rather than moving heavy weight."
      ],
      commonMistakes: [
        "Turning fly into a press by bending elbows to 90 degrees.",
        "Dropping dumbbells below shoulder plane."
      ]
    },
    videoEmbedId: "eozdVDA78K0",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-chin-ups",
    name: "Chin-Ups",
    bodyPart: "Back",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Latissimus Dorsi & Biceps Brachii",
    secondaryMuscles: ["Brachialis", "Forearms", "Teres Major"],
    instructions: {
      setup: "Grip pull-up bar with underhand supinated grip (palms facing you) at shoulder width. Hang at full extension.",
      execution: [
        "Drive elbows down and back while pulling chest upward toward bar.",
        "Pull until chin is cleanly over bar.",
        "Lower under full control back to a dead hang stretch."
      ],
      tips: [
        "Underhand grip gives superior mechanical leverage for biceps.",
        "Keep core tight to eliminate leg swinging."
      ],
      commonMistakes: [
        "Kicking legs to generate momentum.",
        "Cutting range of motion short."
      ]
    },
    videoEmbedId: "b-_S5aflP_4",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-concentration-curl",
    name: "Concentration Curl",
    bodyPart: "Arms",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii (Peak & Short Head)",
    secondaryMuscles: ["Brachialis", "Forearms"],
    instructions: {
      setup: "Sit on bench with legs spread. Brace back of upper arm against inside of same-side thigh holding dumbbell.",
      execution: [
        "Curl dumbbell up toward shoulder without moving elbow from inner thigh.",
        "Squeeze bicep intensely at top contraction.",
        "Lower under strict control to full arm extension."
      ],
      tips: [
        "Inner thigh brace completely eliminates body momentum for pure bicep isolation.",
        "Supinate wrist slightly at top."
      ],
      commonMistakes: [
        "Lifting elbow off thigh.",
        "Swinging torso backward."
      ]
    },
    videoEmbedId: "Jvj2wV0vOYU",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-crossover-fly",
    name: "Crossover Fly",
    bodyPart: "Chest",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Sternal Head (Pectorals)",
    secondaryMuscles: ["Anterior Deltoids"],
    instructions: {
      setup: "Set high cable pulleys. Grip handles, step forward into staggered stance, and lean slightly forward.",
      execution: [
        "With slight elbow bend, bring handles together in sweeping downward arc.",
        "Cross hands slightly at bottom for peak contraction.",
        "Allow cables to pull arms back slowly for deep chest stretch."
      ],
      tips: [
        "Imagine hugging a large tree trunk to keep elbow angle fixed.",
        "Keep chest proud."
      ],
      commonMistakes: [
        "Pressing cables forward instead of flying.",
        "Shrugging shoulders."
      ]
    },
    videoEmbedId: "taI4XduLpBe",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ D ] ═════════════════════ */
  {
    id: "lib-deadlift",
    name: "Deadlift",
    bodyPart: "Back",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Posterior Chain (Glutes, Hamstrings, Erector Spinae)",
    secondaryMuscles: ["Latissimus Dorsi", "Trapezius", "Forearms", "Quadriceps"],
    instructions: {
      setup: "Stand with mid-foot under barbell, feet hip-width apart. Hinge down and grip bar just outside shins.",
      execution: [
        "Pull chest up, pack lats, and take slack out of barbell.",
        "Push floor away with legs, keeping bar in contact with shins and thighs.",
        "Lock hips and knees at top by squeezing glutes into full standing posture."
      ],
      tips: [
        "Keep bar dragged against legs throughout the entire lift.",
        "Maintain high intra-abdominal pressure."
      ],
      commonMistakes: [
        "Rounding lumbar spine under load.",
        "Jerking bar off floor without pre-tension."
      ]
    },
    videoEmbedId: "op9kVnSso6Q",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-decline-press",
    name: "Decline Press",
    bodyPart: "Chest",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Lower Pectoralis Major",
    secondaryMuscles: ["Triceps Brachii", "Anterior Deltoids"],
    instructions: {
      setup: "Lie back on decline bench with legs secured under ankle pads holding dumbbells at chest sides.",
      execution: [
        "Press dumbbells upward over lower chest until arms are extended.",
        "Lower weights under control to sides of lower pectorals.",
        "Press back up smoothly."
      ],
      tips: [
        "Decline angle isolates lower pectoral fibers with minimal shoulder strain.",
        "Keep core braced."
      ],
      commonMistakes: [
        "Allowing dumbbells to drift over face instead of lower chest.",
        "Bouncing at bottom."
      ]
    },
    videoEmbedId: "LfyQBUKR8SE",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-diamond-pushups",
    name: "Diamond Push-Ups",
    bodyPart: "Arms",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Triceps Brachii (Lateral & Medial Heads)",
    secondaryMuscles: ["Inner Pectorals", "Anterior Deltoids", "Core"],
    instructions: {
      setup: "Assume push-up position with hands together under chest, thumbs and index fingers touching to form a diamond shape.",
      execution: [
        "Lower chest toward diamond shape by bending elbows backward along torso.",
        "Keep elbows tucked close to ribcage.",
        "Press forcefully through palms back to full lockout."
      ],
      tips: [
        "Close hand placement dramatically increases tricep recruitment.",
        "If full plank is too difficult, start with knees on the floor."
      ],
      commonMistakes: [
        "Flaring elbows wide to sides.",
        "Sagging hips."
      ]
    },
    videoEmbedId: "J0DnG1_Z3pc",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-dragon-flag",
    name: "Dragon Flag",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Advanced",
    primaryMuscle: "Entire Core & Rectus Abdominis",
    secondaryMuscles: ["Lats", "Hip Flexors", "Glutes"],
    instructions: {
      setup: "Lie on bench holding edge behind head with both hands. Roll shoulders up onto upper traps.",
      execution: [
        "Lift entire body upward in a rigid straight line until almost vertical, resting only on upper back.",
        "Slowly lower body down under control without bending at hips or knees.",
        "Hover just above bench, then raise back up."
      ],
      tips: [
        "Legendary core strength exercise popularized by Bruce Lee.",
        "Maintain a completely straight line from shoulders to toes; do not bend at the waist."
      ],
      commonMistakes: [
        "Bending at hips on descent.",
        "Arching lower back."
      ]
    },
    videoEmbedId: "pvz7sVf_X_s",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ E ] ═════════════════════ */
  {
    id: "lib-ez-curl",
    name: "EZ-Bar Curl",
    bodyPart: "Arms",
    category: "Barbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii",
    secondaryMuscles: ["Brachialis", "Forearms"],
    instructions: {
      setup: "Stand tall holding EZ-bar with underhand grip on angled outer curves.",
      execution: [
        "Curl bar upward to chest level without moving elbows forward.",
        "Squeeze biceps at top contraction.",
        "Lower under 2-second control to full extension."
      ],
      tips: [
        "Angled cambered grip relieves wrist and forearm pronation strain.",
        "Keep elbows pinned to sides."
      ],
      commonMistakes: [
        "Swinging torso back and forth.",
        "Dropping bar rapidly."
      ]
    },
    videoEmbedId: "kwG2ipFRgfo",
    defaultBarWeightLbs: 25
  },

  /* ═════════════════════ [ F ] ═════════════════════ */
  {
    id: "lib-face-pull",
    name: "Face Pull",
    bodyPart: "Shoulders",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Rear Deltoids & Rotator Cuff",
    secondaryMuscles: ["Rhomboids", "Middle Trapezius", "Infraspinatus"],
    instructions: {
      setup: "Attach rope to cable pulley at chest/eye level. Grip rope with thumbs pointing backward.",
      execution: [
        "Pull rope directly toward eye level/nose.",
        "Externally rotate hands back so knuckles face behind you at peak.",
        "Squeeze rear delts and shoulder blades for 1 second, then control return."
      ],
      tips: [
        "Essential postural movement for shoulder longevity and rotator cuff strength.",
        "Focus on external rotation at end of pull."
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
    id: "lib-farmers-walk",
    name: "Farmer's Walk",
    bodyPart: "Core",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Grip / Forearms & Core",
    secondaryMuscles: ["Trapezius", "Glutes", "Calves"],
    instructions: {
      setup: "Deadlift heavy dumbbells or trap bar up with chest tall and shoulders retracted.",
      execution: [
        "Walk forward in smooth, controlled short strides.",
        "Keep core braced and spine perfectly upright with no torso tilting.",
        "Turn around carefully or walk for measured distance/time."
      ],
      tips: [
        "Do not allow weights to bounce against thighs.",
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
  {
    id: "lib-front-raise",
    name: "Front Raise",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Anterior Deltoid (Front Shoulder)",
    secondaryMuscles: ["Upper Pectorals", "Serratus Anterior"],
    instructions: {
      setup: "Stand holding dumbbells in front of thighs with overhand grip and slight bend in elbows.",
      execution: [
        "Raise weights forward and upward until arms are parallel to floor.",
        "Pause briefly at shoulder height.",
        "Lower under steady control back to thighs."
      ],
      tips: [
        "Keep torso upright and avoid leaning backward.",
        "Can be performed alternating or bilateral."
      ],
      commonMistakes: [
        "Using hip swing to heave weights up.",
        "Lifting well above eye level."
      ]
    },
    videoEmbedId: "sOcYlBI85hc",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-front-squat",
    name: "Front Squat",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Quadriceps & Core",
    secondaryMuscles: ["Glutes", "Upper Back", "Calves"],
    instructions: {
      setup: "Rack barbell on front deltoids with fingertips under bar (clean grip) or crossed arms. Keep elbows high.",
      execution: [
        "Inhale and brace core with chest proud and elbows up.",
        "Squat straight down between knees to full depth.",
        "Drive straight up through mid-foot while keeping elbows pointed forward."
      ],
      tips: [
        "High elbows keep bar securely racked and prevent forward collapse.",
        "Targets quadriceps with significantly less lumbar shear stress than back squats."
      ],
      commonMistakes: [
        "Dropping elbows down, causing bar to slip.",
        "Rounding upper thoracic spine."
      ]
    },
    videoEmbedId: "uYumuL_G_V0",
    defaultBarWeightLbs: 45
  },

  /* ═════════════════════ [ G ] ═════════════════════ */
  {
    id: "lib-glute-bridge",
    name: "Glute Bridge",
    bodyPart: "Legs",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Core"],
    instructions: {
      setup: "Lie on back with knees bent and feet flat on floor hip-width apart.",
      execution: [
        "Drive through heels and extend hips upward toward ceiling.",
        "Squeeze glutes hard at top for 2 seconds.",
        "Lower hips under control back to floor."
      ],
      tips: [
        "Do not overarch lower back; focus on glute contraction.",
        "Add a dumbbell or barbell across hips for progressive overload."
      ],
      commonMistakes: [
        "Hyperextending lower back at top.",
        "Pushing through toes instead of heels."
      ]
    },
    videoEmbedId: "wPM8icPu6H8",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-goblet-squat",
    name: "Goblet Squat",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Quadriceps & Gluteus Maximus",
    secondaryMuscles: ["Core", "Upper Back", "Calves"],
    instructions: {
      setup: "Hold dumbbell vertically against upper chest with both hands under top bell, feet shoulder-width.",
      execution: [
        "Squat down by pushing knees outward and hips back, descending between knees.",
        "Keep elbows tracking inside knees at bottom of squat.",
        "Drive through mid-foot to stand back up."
      ],
      tips: [
        "Fantastic squat variation for learning upright posture and hip mobility.",
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
  {
    id: "lib-good-mornings",
    name: "Good Mornings",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Hamstrings, Glutes & Lower Back",
    secondaryMuscles: ["Erector Spinae", "Core"],
    instructions: {
      setup: "Position barbell across upper back as in a squat. Stand with feet hip-width, knees slightly unlocked.",
      execution: [
        "Hinge at hips, pushing hips back and bowing forward until torso is near parallel to floor.",
        "Keep back completely straight and chest open.",
        "Drive hips forward to stand tall and squeeze glutes."
      ],
      tips: [
        "Start light to master the hip hinge pattern.",
        "Keep spine strictly neutral throughout."
      ],
      commonMistakes: [
        "Rounding back.",
        "Bending knees into a squat."
      ]
    },
    videoEmbedId: "vB5OHsJ3EME",
    defaultBarWeightLbs: 45
  },

  /* ═════════════════════ [ H ] ═════════════════════ */
  {
    id: "lib-hack-squat",
    name: "Hack Squat",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    instructions: {
      setup: "Position back against pad on machine. Place feet shoulder-width on platform.",
      execution: [
        "Release safety handles and lower carriage until knees reach 90 degrees or full depth.",
        "Keep lower back flat against back pad throughout descent.",
        "Drive through feet to return to top without locking knees violently."
      ],
      tips: [
        "Feet placed lower emphasizes quads; higher emphasizes glutes.",
        "Provides massive quad isolation with minimal spinal loading."
      ],
      commonMistakes: [
        "Lifting lower back off pad at bottom.",
        "Locking knees aggressively at top."
      ]
    },
    videoEmbedId: "0tn5K9NlCfo",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-hammer-curl",
    name: "Hammer Curl",
    bodyPart: "Arms",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Brachialis & Brachioradialis",
    secondaryMuscles: ["Biceps Brachii (Long Head)", "Forearms"],
    instructions: {
      setup: "Stand tall holding dumbbells with palms facing each other in neutral grip.",
      execution: [
        "Curl dumbbells upward while keeping palms facing each other throughout.",
        "Squeeze at top point when forearms reach near vertical.",
        "Lower with control over 2 seconds."
      ],
      tips: [
        "Builds the brachialis muscle underneath bicep, pushing bicep peak higher and adding arm width.",
        "Keep wrists locked straight."
      ],
      commonMistakes: [
        "Rotating wrists during movement.",
        "Swinging body forward."
      ]
    },
    videoEmbedId: "zC3nLlEvin4",
    defaultBarWeightLbs: 0
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
        "Posteriorly tilt pelvis and lift legs upward until parallel to floor or higher.",
        "Roll pelvis up toward ribcage rather than just swinging legs.",
        "Lower under slow control without swinging."
      ],
      tips: [
        "Bend knees (hanging knee raise) if straight legs are too difficult.",
        "Pause briefly at peak contraction."
      ],
      commonMistakes: [
        "Using body swing momentum.",
        "Only flexing hips without curling pelvis."
      ]
    },
    videoEmbedId: "hdng3Nm1x_E",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-hip-thrust",
    name: "Hip Thrust",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Quadriceps", "Adductors"],
    instructions: {
      setup: "Sit on floor with upper back against bench and padded barbell placed over hips.",
      execution: [
        "Plant feet flat shoulder-width apart, shins vertical at top.",
        "Drive through heels and extend hips upward until thighs and torso form straight line.",
        "Squeeze glutes intensely at lockout, then lower under control."
      ],
      tips: [
        "Keep chin tucked and look forward, not up at ceiling.",
        "Ensure full hip extension without hyperextending lumbar spine."
      ],
      commonMistakes: [
        "Placing feet too far forward or too close.",
        "Overarching lower back at top."
      ]
    },
    videoEmbedId: "SEdqd1n0cvg",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-hyperextensions",
    name: "Hyperextensions (Back Extension)",
    bodyPart: "Back",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Erector Spinae & Glutes",
    secondaryMuscles: ["Hamstrings"],
    instructions: {
      setup: "Position yourself on 45-degree hyperextension bench with hips just above pad and ankles secured.",
      execution: [
        "Cross arms over chest and bend forward at hips until feeling hamstring stretch.",
        "Raise torso back up until body forms straight line.",
        "Squeeze glutes and lower back at top, then lower with control."
      ],
      tips: [
        "Do not over-hyperextend past neutral spine at top.",
        "Hold a weight plate to your chest for extra resistance."
      ],
      commonMistakes: [
        "Hyperextending spine backward at top.",
        "Jerking upward with momentum."
      ]
    },
    videoEmbedId: "ph3pddpKzzw",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ I ] ═════════════════════ */
  {
    id: "lib-incline-bench",
    name: "Incline Bench Press",
    bodyPart: "Chest",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Clavicular Head (Upper Chest)",
    secondaryMuscles: ["Anterior Deltoids", "Triceps Brachii"],
    instructions: {
      setup: "Set incline bench to 30 degrees. Lie back with eyes under bar, grip slightly wider than shoulders.",
      execution: [
        "Unrack bar and lower under control to upper chest/clavicle area.",
        "Keep elbows tucked at ~45 degrees.",
        "Press bar up and slightly backward to full arm lockout over eyes."
      ],
      tips: [
        "30-degree incline is optimal for upper chest; steeper angles shift workload to front delts.",
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
    id: "lib-incline-curl",
    name: "Incline Curl",
    bodyPart: "Arms",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii (Long Head)",
    secondaryMuscles: ["Brachialis", "Forearms"],
    instructions: {
      setup: "Lie on 45–60 degree incline bench, letting arms hang straight down behind torso holding dumbbells.",
      execution: [
        "Curl weights upward while keeping upper arms pointed vertically down toward floor.",
        "Supinate wrists at top and squeeze peak bicep contraction.",
        "Lower under slow control for deep stretch on bicep long head."
      ],
      tips: [
        "Reclined angle places the long head under loaded passive stretch.",
        "Do not swing upper arms forward during curl."
      ],
      commonMistakes: [
        "Bringing elbows forward to assist with front delts.",
        "Using excessive weight."
      ]
    },
    videoEmbedId: "soxrZlIl35U",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-incline-db-press",
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

  /* ═════════════════════ [ J ] ═════════════════════ */
  {
    id: "lib-jm-press",
    name: "JM Press",
    bodyPart: "Arms",
    category: "Barbell",
    difficulty: "Advanced",
    primaryMuscle: "Triceps Brachii",
    secondaryMuscles: ["Chest", "Anterior Deltoids"],
    instructions: {
      setup: "Lie on flat bench gripping barbell at shoulder-width, bar held over upper chest.",
      execution: [
        "Lower bar by dropping elbows down toward ribcage while letting bar travel toward throat/chin.",
        "Forearms and biceps should make contact at bottom.",
        "Press bar up and forward back to lockout using triceps."
      ],
      tips: [
        "Combines close-grip bench press and skullcrusher into a premier powerlifting tricep builder.",
        "Start with light weight to master the bar path."
      ],
      commonMistakes: [
        "Letting elbows flare wide.",
        "Turning it into a standard skullcrusher."
      ]
    },
    videoEmbedId: "4T8W_2h_k6w",
    defaultBarWeightLbs: 45
  },
  {
    id: "lib-jumping-lunges",
    name: "Jumping Lunges",
    bodyPart: "Legs",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Glutes",
    secondaryMuscles: ["Hamstrings", "Calves", "Core"],
    instructions: {
      setup: "Start in forward lunge stance with both knees bent at 90 degrees.",
      execution: [
        "Explode upward off ground, switching leg positions in mid-air.",
        "Land softly in opposite lunge stance and absorb into next rep.",
        "Alternate fluidly back and forth."
      ],
      tips: [
        "Land toe-to-heel softly to absorb impact through muscles.",
        "Keep torso upright and chest open."
      ],
      commonMistakes: [
        "Slamming back knee into floor.",
        "Landing with stiff knees."
      ]
    },
    videoEmbedId: "1ExU8CRmVKA",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ K ] ═════════════════════ */
  {
    id: "lib-kettlebell-swing",
    name: "Kettlebell Swing",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Glutes & Hamstrings",
    secondaryMuscles: ["Core", "Erector Spinae", "Shoulders"],
    instructions: {
      setup: "Stand with feet slightly wider than shoulder-width holding kettlebell with both hands.",
      execution: [
        "Hinge at hips, pushing them back while swinging kettlebell between legs.",
        "Snap hips forward explosively, projecting kettlebell to chest/eye level.",
        "Let kettlebell float weightlessly, then guide it back into next hinge."
      ],
      tips: [
        "Power comes from hip snap, NOT lifting with arms.",
        "Keep arms relaxed like ropes."
      ],
      commonMistakes: [
        "Squatting instead of hinging at hips.",
        "Using shoulders and arms to muscle weight up."
      ]
    },
    videoEmbedId: "YSxHifyI6s8",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ L ] ═════════════════════ */
  {
    id: "lib-lat-pulldown",
    name: "Lat Pulldown",
    bodyPart: "Back",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Latissimus Dorsi",
    secondaryMuscles: ["Biceps Brachii", "Rhomboids", "Middle Trapezius"],
    instructions: {
      setup: "Sit with thighs secured under pads. Grip wide bar with overhand grip wider than shoulders.",
      execution: [
        "Pull shoulder blades down and pull bar smoothly to upper chest.",
        "Drive elbows down and back, squeezing lats at bottom.",
        "Control bar back up to full stretch overhead."
      ],
      tips: [
        "Lean back slightly (~10–15 degrees) for optimal lat recruitment.",
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
    id: "lib-lateral-raise",
    name: "Lateral Raise",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Lateral Deltoid (Side Shoulder)",
    secondaryMuscles: ["Supraspinatus", "Upper Trapezius"],
    instructions: {
      setup: "Stand with dumbbells at sides, palms facing thighs, with slight forward torso lean ~10 degrees.",
      execution: [
        "Raise dumbbells outward in scapular plane until upper arms are parallel to floor.",
        "Lead with elbows and maintain slight bend in arms.",
        "Lower weights with controlled 2-second eccentric phase."
      ],
      tips: [
        "Think of pouring water from a pitcher at peak to keep side delts isolated.",
        "Avoid using heavy momentum."
      ],
      commonMistakes: [
        "Swinging body and arching lower back.",
        "Shrugging shoulders up toward ears."
      ]
    },
    videoEmbedId: "3VcKaXpzqRo",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-leg-extension",
    name: "Leg Extension",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Quadriceps (Rectus Femoris)",
    secondaryMuscles: ["Vastus Medialis", "Vastus Lateralis"],
    instructions: {
      setup: "Adjust pad against lower shins just above ankles, knees aligned with machine pivot point.",
      execution: [
        "Extend knees to lift weight until legs are nearly straight.",
        "Squeeze quadriceps firmly at full extension.",
        "Lower weight slowly under 2-second control."
      ],
      tips: [
        "Keep hips pinned to seat using side handles.",
        "Directly isolates and burns out quadriceps."
      ],
      commonMistakes: [
        "Kicking legs explosively with momentum.",
        "Lifting buttocks off seat."
      ]
    },
    videoEmbedId: "YyvSfVjQeL0",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-leg-press",
    name: "Leg Press",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Calves"],
    instructions: {
      setup: "Sit with lower back flat against pad. Place feet shoulder-width on footplate.",
      execution: [
        "Release safety bars and lower sled until knees form roughly 90 degrees.",
        "Press through mid-foot to push sled back up.",
        "Stop just short of locking knees at top."
      ],
      tips: [
        "Never let lower back curl or lift off seat pad at bottom.",
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
    name: "Lying Leg Curl",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["Calves"],
    instructions: {
      setup: "Lie face down with padded lever just below calf muscles on Achilles tendon.",
      execution: [
        "Curl legs upward toward glutes as far as possible.",
        "Squeeze hamstrings for 1 second at full contraction.",
        "Lower under controlled eccentric tempo back to starting position."
      ],
      tips: [
        "Keep hips pressed firmly into bench throughout curl.",
        "Dorsiflex ankles for optimal hamstring focus."
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
      setup: "Assume high push-up plank with hands under shoulders and body in straight line.",
      execution: [
        "Drive one knee forward toward chest rapidly.",
        "Quickly switch legs, extending first leg back while driving opposite knee forward.",
        "Maintain steady sprinting pace while keeping hips level."
      ],
      tips: [
        "Keep shoulders over wrists and avoid letting hips bounce up.",
        "Great for conditioning and core endurance."
      ],
      commonMistakes: [
        "Hips piked high in air.",
        "Bouncing weight onto toes."
      ]
    },
    videoEmbedId: "nmwgirgXLYM",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-muscle-up",
    name: "Muscle-Up",
    bodyPart: "Back",
    category: "Bodyweight",
    difficulty: "Advanced",
    primaryMuscle: "Lats, Chest & Triceps",
    secondaryMuscles: ["Shoulders", "Forearms", "Core"],
    instructions: {
      setup: "Hang from pull-up bar with false grip (wrists over bar).",
      execution: [
        "Pull explosively upward toward upper chest/sternum.",
        "Transition shoulders rapidly over the bar at peak height.",
        "Press body upward to complete straight-arm dip lockout over bar."
      ],
      tips: [
        "The transition from pull to push requires explosive pulling power and wrist rotation.",
        "Master strict pull-ups and straight bar dips before attempting."
      ],
      commonMistakes: [
        "Attempting with one arm over at a time (chicken winging).",
        "Lack of pulling height."
      ]
    },
    videoEmbedId: "5Ff7bZgD3zE",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ N ] ═════════════════════ */
  {
    id: "lib-nordic-curl",
    name: "Nordic Hamstring Curl",
    bodyPart: "Legs",
    category: "Bodyweight",
    difficulty: "Advanced",
    primaryMuscle: "Hamstrings (Eccentric Strength)",
    secondaryMuscles: ["Glutes", "Calves", "Core"],
    instructions: {
      setup: "Kneel on padded mat with ankles securely anchored under heavy bar or by a partner.",
      execution: [
        "Keep body in rigid straight line from knees to head.",
        "Slowly lower torso forward toward floor, resisting gravity purely with hamstrings.",
        "Catch yourself with hands on floor, push lightly off floor, and pull back up with hamstrings."
      ],
      tips: [
        "The gold standard exercise for hamstring injury prevention and athletic eccentric strength.",
        "Do not bend at the hips."
      ],
      commonMistakes: [
        "Breaking at hips on descent.",
        "Dropping without resisting the negative."
      ]
    },
    videoEmbedId: "d8AsZpD3x6c",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ O ] ═════════════════════ */
  {
    id: "lib-overhead-press",
    name: "Overhead Press",
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
        "Keep forearms vertical directly beneath bar."
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
    id: "lib-overhead-tricep-ext",
    name: "Overhead Tricep Extension",
    bodyPart: "Arms",
    category: "Cable",
    difficulty: "Beginner",
    primaryMuscle: "Triceps Brachii (Long Head)",
    secondaryMuscles: ["Anconeus"],
    instructions: {
      setup: "Attach rope to low/mid cable pulley. Turn away from machine, hold rope behind head with elbows pointing forward.",
      execution: [
        "Extend forearms forward and overhead until arms are straight.",
        "Spread rope ends apart at full extension for peak tricep contraction.",
        "Lower rope slowly behind head for deep stretch on long head."
      ],
      tips: [
        "Overhead position maximally stretches long head of triceps.",
        "Keep upper arms stationary next to head."
      ],
      commonMistakes: [
        "Flaring elbows wide open.",
        "Using torso momentum."
      ]
    },
    videoEmbedId: "ns-RgSbDu0A",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ P ] ═════════════════════ */
  {
    id: "lib-pec-deck",
    name: "Pec Deck Fly",
    bodyPart: "Chest",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Pectoralis Major (Sternal Head)",
    secondaryMuscles: ["Anterior Deltoids"],
    instructions: {
      setup: "Adjust seat so handles align with mid-chest. Sit with back flat against pad and grip levers.",
      execution: [
        "Bring handles together in front of chest in smooth arc.",
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
    name: "Plank",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscle: "Transverse Abdominis & Rectus Abdominis",
    secondaryMuscles: ["Glutes", "Shoulders", "Lower Back"],
    instructions: {
      setup: "Place forearms on floor with elbows under shoulders, legs extended back with toes on floor.",
      execution: [
        "Lift body into rigid straight line from head to heels.",
        "Squeeze glutes, pull belly button into spine, and hold tension.",
        "Breathe steadily without letting hips sag or pike."
      ],
      tips: [
        "Actively pull elbows toward toes to generate maximum abdominal tension.",
        "Focus on quality isometric tension over duration."
      ],
      commonMistakes: [
        "Hips sagging down toward floor.",
        "Piking hips in air."
      ]
    },
    videoEmbedId: "ASdvN_XEl_c",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-preacher-curl",
    name: "Preacher Curl",
    bodyPart: "Arms",
    category: "Barbell",
    difficulty: "Beginner",
    primaryMuscle: "Biceps Brachii (Short Head)",
    secondaryMuscles: ["Brachialis", "Forearms"],
    instructions: {
      setup: "Sit at preacher bench with upper arms resting flush against pad. Grip inner curves of EZ-bar.",
      execution: [
        "Curl bar upward until forearms are nearly vertical.",
        "Squeeze biceps firmly at top contraction.",
        "Lower under slow control to full arm extension without hyper-extending elbows."
      ],
      tips: [
        "Preacher pad completely eliminates shoulder cheating and body momentum.",
        "Keep armpits nestled against top of pad."
      ],
      commonMistakes: [
        "Lifting body off seat to heave weight.",
        "Dropping bar too fast at bottom."
      ]
    },
    videoEmbedId: "fIWP-FRFNU0",
    defaultBarWeightLbs: 25
  },
  {
    id: "lib-pullups",
    name: "Pull-Ups",
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
        "Lower under complete control back to dead hang."
      ],
      tips: [
        "Keep chest driven upward toward bar.",
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
      setup: "Place hands slightly wider than shoulder-width, body in rigid plank from head to heels.",
      execution: [
        "Lower body under control until chest is 1 inch from floor, elbows at ~45 degrees.",
        "Press through palms to return to top with core tight.",
        "Repeat with consistent tempo."
      ],
      tips: [
        "Keep core and glutes engaged to maintain rigid plank.",
        "Elevate hands on bench to regress, or feet on bench to progress."
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
    name: "Rear Delt Fly",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Posterior Deltoid",
    secondaryMuscles: ["Infraspinatus", "Rhomboids", "Trapezius"],
    instructions: {
      setup: "Hinge at hips with flat back (or lie chest-down on incline bench) holding dumbbells hanging down with slight elbow bend.",
      execution: [
        "Raise dumbbells out to sides in wide arc until elbows reach shoulder level.",
        "Squeeze rear deltoids firmly at top.",
        "Lower dumbbells under slow control."
      ],
      tips: [
        "Keep pinkies higher than thumbs to isolate posterior deltoid.",
        "Do not use heavy weights that compromise strict form."
      ],
      commonMistakes: [
        "Using back momentum to fling weights.",
        "Shrugging traps instead of rear delts."
      ]
    },
    videoEmbedId: "yN6Q13_6Zmw",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-rdl",
    name: "Romanian Deadlift (RDL)",
    bodyPart: "Legs",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Hamstrings & Gluteus Maximus",
    secondaryMuscles: ["Erector Spinae", "Latissimus Dorsi", "Forearms"],
    instructions: {
      setup: "Stand holding bar with overhand shoulder-width grip, feet hip-width, knees slightly unlocked.",
      execution: [
        "Hinge at hips, pushing them backward while lowering bar down shins.",
        "Keep bar in close contact with legs and back straight.",
        "When feeling maximum hamstring stretch, drive hips forward to stand."
      ],
      tips: [
        "Think of trying to touch a wall behind you with your glutes.",
        "Movement is horizontal hip displacement, not vertical squatting."
      ],
      commonMistakes: [
        "Rounding lower back.",
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
        "Rotate torso side to side, bringing hands/weight to touch floor beside hips.",
        "Keep chest open and core braced tight.",
        "Alternate sides smoothly with control."
      ],
      tips: [
        "Rotate with shoulders and ribs, not just waving arms.",
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
        "Squeeze shoulder blades together for 1 second, then control return."
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
    id: "lib-seated-leg-curl",
    name: "Seated Leg Curl",
    bodyPart: "Legs",
    category: "Machine",
    difficulty: "Beginner",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["Calves"],
    instructions: {
      setup: "Sit on machine with thigh pad secured over lower thighs and ankle pad positioned behind lower calves.",
      execution: [
        "Curl legs downward and backward under seat as far as possible.",
        "Squeeze hamstrings intensely at peak contraction.",
        "Control weight back up slowly to a full stretch."
      ],
      tips: [
        "Seated position places hamstrings under greater stretch at hip, yielding superior hypertrophy.",
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
    id: "lib-seated-shoulder-press",
    name: "Seated Shoulder Press",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Anterior & Lateral Deltoids",
    secondaryMuscles: ["Triceps Brachii", "Upper Traps"],
    instructions: {
      setup: "Sit on upright bench with dumbbells at shoulder height, palms facing forward.",
      execution: [
        "Press dumbbells upward in an arc until arms are extended overhead.",
        "Lower under steady control until dumbbells reach ear level.",
        "Repeat without clanking weights at top."
      ],
      tips: [
        "Keep elbows angled slightly forward in scapular plane (~30 degrees).",
        "Maintain back contact with bench pad."
      ],
      commonMistakes: [
        "Overarching lower back off pad.",
        "Short-changing range of motion at bottom."
      ]
    },
    videoEmbedId: "qEwKCR5JCog",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-shrugs",
    name: "Shrugs",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Beginner",
    primaryMuscle: "Upper Trapezius",
    secondaryMuscles: ["Forearms / Grip", "Levator Scapulae"],
    instructions: {
      setup: "Stand tall holding heavy dumbbells at your sides with arms straight down.",
      execution: [
        "Elevate shoulders straight up toward ears as high as possible.",
        "Hold and squeeze upper traps at peak contraction for 1.5 seconds.",
        "Lower under control back to a deep stretch."
      ],
      tips: [
        "Move strictly straight up and down — never roll shoulders in circles.",
        "Use straps if grip tires out before traps."
      ],
      commonMistakes: [
        "Rolling shoulders in circles (injures rotator cuff).",
        "Bending elbows to assist lift."
      ]
    },
    videoEmbedId: "g6qbq481x_Q",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-single-arm-row",
    name: "Single-Arm Row",
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
    id: "lib-skull-crusher",
    name: "Skull Crusher",
    bodyPart: "Arms",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Triceps Brachii (Long & Lateral Heads)",
    secondaryMuscles: ["Anconeus", "Forearms"],
    instructions: {
      setup: "Lie on flat bench holding EZ-bar over chest with overhand grip and arms angled slightly back toward head.",
      execution: [
        "Bending only at elbows, lower bar toward forehead or crown of head.",
        "Keep upper arms stationary and angled back to keep constant tricep tension.",
        "Extend forearms forcefully back to top lockout."
      ],
      tips: [
        "Angling upper arms slightly back prevents tricep tension loss at top.",
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
        "Lower heels deeply below platform level for a full calf stretch.",
        "Drive through balls of feet and elevate heels as high as possible onto tiptoes.",
        "Pause for 1 second at top contraction."
      ],
      tips: [
        "Full stretch at bottom and 1-second pause at top triggers maximum calf growth.",
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
    id: "lib-thrusters",
    name: "Thrusters",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Shoulders",
    secondaryMuscles: ["Glutes", "Triceps", "Core"],
    instructions: {
      setup: "Hold dumbbells at shoulder height with palms facing inward, feet shoulder-width apart.",
      execution: [
        "Squat down until thighs are parallel to ground.",
        "Drive explosively up through heels, using hip momentum to press dumbbells overhead into full lockout.",
        "Lower dumbbells back to shoulders as you transition into next squat."
      ],
      tips: [
        "Combine squat and overhead press into one fluid motion.",
        "Excellent high-intensity conditioning movement."
      ],
      commonMistakes: [
        "Pressing before hips fully extend.",
        "Collapsing chest forward during squat."
      ]
    },
    videoEmbedId: "L219ltL15zk",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-tricep-dips",
    name: "Tricep Dips",
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
        "Upright torso isolates triceps; leaning forward shifts load to chest.",
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
  {
    id: "lib-tricep-pushdown",
    name: "Tricep Pushdown",
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
        "Keep upper arms pinned to sides with zero swinging.",
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

  /* ═════════════════════ [ U ] ═════════════════════ */
  {
    id: "lib-upright-row",
    name: "Upright Row",
    bodyPart: "Shoulders",
    category: "Barbell",
    difficulty: "Intermediate",
    primaryMuscle: "Lateral Deltoids & Upper Trapezius",
    secondaryMuscles: ["Biceps", "Forearms"],
    instructions: {
      setup: "Stand holding bar with overhand grip at shoulder-width (not narrow).",
      execution: [
        "Pull bar vertically along torso, leading with elbows until reaching shoulder height.",
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
    name: "V-Ups",
    bodyPart: "Core",
    category: "Bodyweight",
    difficulty: "Intermediate",
    primaryMuscle: "Rectus Abdominis",
    secondaryMuscles: ["Hip Flexors", "Obliques"],
    instructions: {
      setup: "Lie flat on back with arms extended overhead and legs straight together.",
      execution: [
        "Simultaneously lift legs and torso into air, reaching hands to touch toes in 'V' shape.",
        "Balance on tailbone at peak contraction.",
        "Lower slowly back to floor without letting lower back arch."
      ],
      tips: [
        "Keep legs and arms as straight as possible.",
        "Exhale forcefully on crunch."
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
    name: "Walking Lunges",
    bodyPart: "Legs",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Quadriceps & Gluteus Maximus",
    secondaryMuscles: ["Hamstrings", "Calves", "Core"],
    instructions: {
      setup: "Stand holding dumbbells at sides. Keep chest tall and shoulders back.",
      execution: [
        "Step forward into a lunge, lowering back knee to hover 1 inch above floor.",
        "Drive through front heel to step directly forward into next lunge with opposite leg.",
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
    id: "lib-woodchopper",
    name: "Woodchopper",
    bodyPart: "Core",
    category: "Cable",
    difficulty: "Intermediate",
    primaryMuscle: "Internal & External Obliques",
    secondaryMuscles: ["Transverse Abdominis", "Shoulders", "Hips"],
    instructions: {
      setup: "Set high cable pulley. Stand sideways with feet wide, holding handle with both hands over high shoulder.",
      execution: [
        "Rotate torso downward and across body toward opposite knee in chopping motion.",
        "Pivot on back foot as you twist, keeping arms relatively straight.",
        "Control return back to high position."
      ],
      tips: [
        "Power motion with abdominal oblique rotation, not arms.",
        "Keep hips and core braced throughout."
      ],
      commonMistakes: [
        "Bending elbows and pulling with arms.",
        "Rounding back during twist."
      ]
    },
    videoEmbedId: "pZapRXZcggk",
    defaultBarWeightLbs: 0
  },
  {
    id: "lib-wrist-curl",
    name: "Wrist Curls",
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

  /* ═════════════════════ [ Y ] ═════════════════════ */
  {
    id: "lib-y-raises",
    name: "Y-Raises",
    bodyPart: "Shoulders",
    category: "Dumbbell",
    difficulty: "Intermediate",
    primaryMuscle: "Lower Trapezius & Rear Deltoids",
    secondaryMuscles: ["Lateral Deltoids", "Rotator Cuff"],
    instructions: {
      setup: "Lie chest-down on an incline bench holding light dumbbells with arms hanging down.",
      execution: [
        "Raise arms upward and outward at a 45-degree angle forming a 'Y' shape with your body.",
        "Keep thumbs pointing upward toward ceiling.",
        "Pause and squeeze lower traps between shoulder blades for 1 second at top, then lower with control."
      ],
      tips: [
        "Crucial for scapular upward rotation, overhead pressing health, and shoulder stability.",
        "Use very light weights to maintain pure lower trap engagement."
      ],
      commonMistakes: [
        "Using heavy weight and arching lower back.",
        "Turning thumbs downward (impinges rotator cuff)."
      ]
    },
    videoEmbedId: "K6KxJj0fLHg",
    defaultBarWeightLbs: 0
  },

  /* ═════════════════════ [ Z ] ═════════════════════ */
  {
    id: "lib-z-press",
    name: "Z-Press",
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
        "Sitting on floor completely removes leg drive and forces absolute core stability and strict shoulder power.",
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
        "Lower weights slowly in overhand position to blast forearm brachioradialis.",
        "Rotate back to palms-up at bottom and repeat."
      ],
      tips: [
        "Combines concentric bicep loading with eccentric forearm overload in one exercise.",
        "Perform with strict tempo."
      ],
      commonMistakes: [
        "Rotating wrists during lift instead of at top.",
        "Dropping weights quickly."
      ]
    },
    videoEmbedId: "ZrpRBgntHsU",
    defaultBarWeightLbs: 0
  }
];
