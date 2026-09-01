import type { Dictionary } from './en'

/**
 * Turkish copy.
 *
 * PROVENANCE — worth knowing when reviewing this file:
 *
 *   upper-pull (1b), upper-pull-stretch (2b), lower-body (3)
 *     The author's OWN Turkish, taken verbatim from content/*.tr.txt, split
 *     across the reps / sets / rest / note fields. Do not paraphrase these.
 *
 *   warm-up (0), upper-push (1a), upper-push-stretch (2a),
 *   lower-body-stretch (4)
 *     Machine-authored, written to match the register of the files above
 *     ('6 tekrar', 'Set arası dinlenme' -> rest, '30 sn.' / '30ar sn.').
 *     These are the ones that want an owner review.
 *
 * Exercise NAMES stay in their English gym form in both languages, which is
 * what the author's own Turkish files do.
 */
export const tr: Dictionary = {
  ui: {
    appTitle: 'ANTRENMAN PLANI',
    tagline: 'Kişisel antrenman programı',
    groupsHeading: 'GRUPLAR',
    exercisesHeading: 'EGZERSİZLER',
    allGroups: 'TÜM GRUPLAR',
    backToGroup: 'GRUBA DÖN',
    home: 'ANA SAYFA',
    previous: 'ÖNCEKİ',
    next: 'SONRAKİ',
    repsLabel: 'TEKRAR',
    durationLabel: 'SÜRE',
    setsLabel: 'SET',
    restLabel: 'DİNLENME',
    noteLabel: 'NOT',
    languageLabel: 'Dil',
    notFoundTitle: 'BULUNAMADI',
    notFoundBody: 'Böyle bir sayfa yok.',
    videoUnsupported: 'Tarayıcınız bu videoyu oynatamıyor.',
    exerciseCount: (count: number): string => `${count} egzersiz`,
    exercisePosition: (index: number, total: number): string =>
      `${index} / ${total}`,
  },
  groups: {
    'warm-up': {
      title: 'ISINMA VE POSTÜR EGZERSİZLERİ',
      subtitle: 'Her antrenmandan önce yap.',
      exercises: {
        'knee-side-drops': {
          name: 'KNEE SIDE DROPS',
          reps: '20 tekrar',
        },
        'supine-straight-leg-circle': {
          name: 'SUPINE STRAIGHT LEG CIRCLE',
          reps: '15 sağ / 15 sol',
        },
        'bodyweight-glute-bridge': {
          name: 'BODYWEIGHT GLUTE BRIDGE',
          reps: '15 tekrar, 2 set',
        },
        'scapular-retraction': {
          name: 'SCAPULAR RETRACTION',
          reps: '15 tekrar',
        },
        'thoracic-extension': {
          name: 'THORACIC EXTENSION',
          reps: '10 tekrar, 2 set',
        },
        'elbow-thoracic-rotation': {
          name: 'ELBOW THORACIC ROTATION',
          reps: '10 sağ / 10 sol, her biri 2 set',
        },
        'prone-swimmer': {
          name: 'PRONE SWIMMER',
          reps: '10 tekrar, 2 set',
        },
        'prone-w': {
          name: 'PRONE W',
          reps: '15 tekrar, 2 set',
        },
      },
    },
    'upper-push': {
      title: 'ÜST VÜCUT İTİŞ ANTRENMANI',
      subtitle: 'Göğüs, omuz ve arka kol.',
      exercises: {
        'flat-bench-barbell-press': {
          name: 'FLAT BENCH BARBELL PRESS',
          reps: '6 tekrar',
          sets: '3 set (son set rest/pause sistemi)',
          rest: '75-90 sn.',
          note: 'rest/pause sistemi = son sette 6 tekrarın ardından 10-12 sn. dinlen, aynı ağırlık ile 3-4 tekrar daha zorla, ardından 15 sn. daha dinlen ve aynı ağırlık ile 2-3 tekrar daha zorlayıp seti bitir.',
        },
        'standing-military-press': {
          name: 'STANDING MILITARY PRESS',
          reps: '8 tekrar',
          sets: '3 set',
          rest: '60-75 sn.',
          note: 'tempo = 3/2/1/2 = 3 saniyede barı çene hizasına indir, 2 saniye çene hizasında bekle, 1 saniyede kontrollü ama patlayıcı şekilde yukarı it, 2 saniye başüstünde tut ve tekrarla.',
        },
        'incline-bench-dumbbell-fly': {
          name: 'INCLINE BENCH DUMBBELL FLY',
          reps: '8-10 tekrar aralığı',
          sets: '3 set',
          rest: '60-75 sn.',
          note: 'tempo = 2/3/1/2 = 2 saniyede dumbellları yanlara indir/aç, 3 saniye göğsün en çok uzadığı noktada bekle, 1 saniyede kontrollü kapat ve tepede 2 saniye göğüs kaslarını sıkıştır.',
        },
        'incline-bench-one-arm-lateral-raise': {
          name: 'INCLINE BENCH ONE ARM LATERAL RAISE',
          reps: '10-12 tekrar aralığı',
          sets: '3 set (her kol için)',
          rest: '45-60 sn.',
        },
        'barbell-skull-crushers': {
          name: 'BARBELL SKULL CRUSHERS',
          reps: '8 tekrar',
          sets: '3 set (son set rest/pause sistemi)',
          rest: '60-75 sn.',
          note: 'rest/pause sistemi = bench press ile aynı sistem.',
        },
        'single-arm-rope-pushdown': {
          name: 'SINGLE ARM ROPE PUSHDOWN',
          reps: '8 tekrar',
          sets: '3 set (son set 8-10-12 drop set)',
          rest: '60-75 sn.',
          note: '8-10-12 drop set = son sette 8 tekrarın ardından ağırlığı %30-35 hafifletip 10 tekrar daha yap, ardından bir kez daha ağırlığı %30-35 hafifletip 12 tekrar daha zorla ve diğer kola geç.',
        },
      },
    },
    'upper-pull': {
      title: 'ÜST VÜCUT ÇEKİŞ ANTRENMANI',
      subtitle: 'Sırt ve ön kol.',
      exercises: {
        'one-arm-dumbbell-row': {
          name: 'ONE ARM DUMBBELL ROW',
          reps: '6 tekrar',
          sets: '3 set (son set rest/pause sistemi)',
          rest: '75-90 sn.',
          note: 'rest/pause sistemi = son sette 6 tekrarın ardından dumbellı yere koy, 10-12 sn. dinlenip tekrar aynı dumbell ile 3-4 tekrar daha zorla, ardından bir kez daha yere koyup 15 sn. dinlen ve yine aynı dumbell ile 2-3 tekrar daha zorlayıp diğer kola geç.',
        },
        'incline-bench-barbell-high-row': {
          name: 'INCLINE BENCH BARBELL HIGH ROW',
          reps: '8-10 tekrar aralığı',
          sets: '3 set',
          rest: '60-75 sn.',
          note: 'Her sette barı göğsüne doğru çek ve kürek kemiklerini sıkıştır.',
        },
        'barbell-pullover-for-lats': {
          name: 'BARBELL PULLOVER FOR LATS',
          reps: '10-12 tekrar aralığı',
          sets: '3 set',
          rest: '60 sn.',
          note: 'tempo = 2/2/2/1 = 2 saniyede barı başüstüne indir, 2 saniye kasın iyice uzadığı noktada bekle, 2 saniyede barı göğüs hizana çek ve 1 sn. duraksayıp tekrarla.',
        },
        'bent-over-reverse-fly': {
          name: 'BENT OVER REVERSE FLY',
          reps: '12-15 tekrar aralığı',
          sets: '3 set',
          rest: '45 sn.',
        },
        'concentration-curl': {
          name: 'CONCENTRATION CURL',
          reps: '8 tekrar',
          sets: '3 set (son set 8-10-12 drop set)',
          rest: '60-75 sn.',
          note: '8-10-12 drop set = son sette 8 tekrarın ardından dumbellı %30-35 hafifletip 10 tekrar daha yap, ardından bir kez daha hiç dinlenmeden dumbellı %30-35 hafifletip 12 tekrar daha yap ve diğer kola geç.',
        },
        'incline-bench-hammer-curl': {
          name: 'INCLINE BENCH HAMMER CURL',
          reps: '8-10 tekrar aralığı',
          sets: '3 set',
          rest: '60 sn.',
        },
      },
    },
    'upper-push-stretch': {
      title: 'ÜST VÜCUT İTİŞ — ANTRENMAN SONU ESNEME',
      subtitle: 'İtiş antrenmanından sonra yap.',
      exercises: {
        'knee-hug-stretch': {
          name: 'KNEE HUG STRETCH',
          reps: '1',
          duration: '30 sn.',
        },
        'standing-wall-chest-stretch': {
          name: 'STANDING WALL CHEST STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'kneeling-minor-chest-stretch': {
          name: 'KNEELING MINOR CHEST STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'standing-both-arm-shoulder-stretch': {
          name: 'STANDING BOTH ARM SHOULDER STRETCH',
          reps: '1',
          duration: '30 sn.',
        },
        'standing-one-arm-shoulder-stretch': {
          name: 'STANDING ONE ARM SHOULDER STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'wall-thoracic-extension-stretch': {
          name: 'WALL THORACIC EXTENSION STRETCH',
          reps: '1',
          duration: '30 sn.',
        },
        'wall-triceps-stretch': {
          name: 'WALL TRICEPS STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'cobra-pose': {
          name: 'COBRA POSE',
          reps: '1',
          duration: '30 sn.',
        },
      },
    },
    'upper-pull-stretch': {
      title: 'ÜST VÜCUT ÇEKİŞ — ANTRENMAN SONU ESNEME',
      subtitle: 'Çekiş antrenmanından sonra yap.',
      exercises: {
        'knee-hug-stretch': {
          name: 'KNEE HUG STRETCH',
          reps: '1',
          duration: '30 sn.',
        },
        'kneeling-lat-stretch': {
          name: 'KNEELING LAT STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'cat-pose-stretch': {
          name: 'CAT POSE STRETCH',
          reps: '1',
          duration: '30 sn.',
        },
        'thread-the-needle-stretch': {
          name: 'THREAD THE NEEDLE STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'wall-thoracic-extension-stretch': {
          name: 'WALL THORACIC EXTENSION STRETCH',
          reps: '1',
          duration: '30 sn.',
        },
        'standing-wall-biceps-stretch': {
          name: 'STANDING WALL BICEPS STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'kneeling-biceps-stretch': {
          name: 'KNEELING BICEPS STRETCH',
          reps: '1',
          duration: '30 sn.',
        },
        'cobra-pose': {
          name: 'COBRA POSE',
          reps: '1',
          duration: '30 sn.',
        },
      },
    },
    'lower-body': {
      title: 'ALT VÜCUT ANTRENMANI',
      subtitle: 'Kalça, ön bacak, arka bacak ve baldır.',
      exercises: {
        'barbell-hip-thrust': {
          name: 'BARBELL HIP THRUST',
          reps: '6 tekrar',
          sets: '3 set (son set rest/pause sistemi)',
          rest: '90 sn.',
          note: 'rest/pause = son sette 6 tekrarın ardından yere otur, 10-12 sn. dinlen, aynı ağırlık ile 3-4 tekrar daha zorla, ardından 15 sn. dinlen ve bir kez daha aynı ağırlık ile 2-3 tekrar daha zorlayıp bitir.',
        },
        'smith-machine-bulgarian-squat': {
          name: 'SMITH MACHINE BULGARIAN SQUAT',
          reps: '8 tekrar',
          sets: '3 set',
          rest: '75-90 sn.',
        },
        'dumbbell-walking-lunge': {
          name: 'DUMBBELL WALKING LUNGE',
          reps: '20 adım',
          sets: '3 set',
          rest: '60 sn.',
        },
        'leg-curl-single-leg': {
          name: 'LEG CURL (TEK BACAK)',
          reps: '8 tekrar',
          sets: '3 set (son set 8-10-12 drop set)',
          rest: '60 sn.',
          note: '8-10-12 drop set = son sette 8 tekrarın ardından ağırlığı %30-35 azaltıp 10 tekrar daha yap, ardından bir kez daha dinlenmeden ağırlığı %30-35 azaltıp 12 tekrar daha zorla ve diğer bacağa geç.',
        },
        'smith-machine-calf-raise': {
          name: 'SMITH MACHINE CALF RAISE',
          reps: '10-15 tekrar aralığı',
          sets: '3 set',
          rest: '45 sn.',
        },
      },
    },
    'lower-body-stretch': {
      title: 'ALT VÜCUT — ANTRENMAN SONU ESNEME',
      subtitle: 'Alt vücut antrenmanından sonra yap.',
      exercises: {
        'childs-pose': {
          name: "CHILD'S POSE",
          reps: '1',
          duration: '30 sn.',
        },
        'cobra-pose': {
          name: 'COBRA POSE',
          reps: '1',
          duration: '30 sn.',
        },
        '90-90-hip-flexor-stretch': {
          name: '90-90 HIP FLEXOR STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'pigeon-pose': {
          name: 'PIGEON POSE',
          reps: '1',
          duration: '30ar sn.',
        },
        'figure-4-stretch': {
          name: 'FIGURE 4 STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'supine-hamstring-stretch': {
          name: 'SUPINE HAMSTRING STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'side-lying-quad-stretch': {
          name: 'SIDE LYING QUAD STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
        'wall-calf-stretch': {
          name: 'WALL CALF STRETCH',
          reps: '1',
          duration: '30ar sn.',
        },
      },
    },
  },
}
