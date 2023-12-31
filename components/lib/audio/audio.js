let audioFiles = {};

if (typeof window !== 'undefined') {
    // const edUrinalSoundClip = new Audio("/audio/ed-urinal.m4a");
    const edGirldadSoundClip = new Audio("/audio/ed-girldad.m4a");
    const edSnakeSoundClip = new Audio("/audio/ed-snake.m4a");
    const edSnoreSoundClip = new Audio("/audio/ed-snore.m4a");
    const edTravelSoundClip = new Audio("/audio/ed-travel.m4a");
    const edKingSoundClip = new Audio("/audio/ed-king.m4a");
    const edGiselleSoundClip = new Audio("/audio/ed-giselle.m4a");
    const edSantaSoundClip = new Audio("/audio/ed-santa.m4a");
    // const edToesSoundClip = new Audio("/audio/ed-toes.m4a");
    const obBoyDadSoundClip = new Audio("/audio/OB-boydad.m4a");
    // const obTesticsSoundClip = new Audio("/audio/OB-testics.m4a");
    const obSwordsSoundClip = new Audio("/audio/OB-swords.m4a");
    const obVacationSoundClip = new Audio("/audio/OB-vacation.m4a");
    const obDWMSoundClip = new Audio("/audio/OB-DWM.m4a");
    const obRawdogSoundClip = new Audio("/audio/OB-rawdog.m4a")
    const obBearSoundClip = new Audio("/audio/OB-bear.m4a");
    const obSockieSoundClip = new Audio("/audio/OB-sockie.m4a");
    // const ericSoundClip = new Audio("sounds/eric.m4a");



  audioFiles = {
    "ed-girldad": { audioFile: edGirldadSoundClip, text: "girl dad" },
    "ed-snake": { audioFile: edSnakeSoundClip, text: "crippling fear of small woodpile snakes" },
    "ed-snore": { audioFile: edSnoreSoundClip, text: "major snoring problem" },
    "ed-travel": { audioFile: edTravelSoundClip, text: "gets anxious before traveling" },
    "ed-king": { audioFile: edKingSoundClip, text: "thinks if you marry a queen you should be a 'king'" },
    "ed-giselle": { audioFile: edGiselleSoundClip, text: "has his own take on Brazilian naming conventions" },
    "ed-santa": { audioFile: edSantaSoundClip, text: "thinks Santa Claus is biblical" },
    "ob-boydad": { audioFile: obBoyDadSoundClip, text: "boy dad" },
    "ob-swords": { audioFile: obSwordsSoundClip, text: "swordfighter (he calls it 'martial arts')" },
    "ob-vacation": { audioFile: obVacationSoundClip, text: "will only travel with 3 out of 4 family members" },
    "ob-dwm": { audioFile: obDWMSoundClip, text: "once mansplained 'dancing with myself'" },
    "ob-rawdog": { audioFile: obRawdogSoundClip, text: "used the term 'rawdogging' on air" },
    "ob-bear": { audioFile: obBearSoundClip, text: "thinks he can take on any bear with a machete" },
    "ob-sockie": { audioFile: obSockieSoundClip, text: "wears 'sockie' type shoes when playing with swords" }
  };
}

export default audioFiles;