import type { Dictionary } from './en'

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
  },
}
