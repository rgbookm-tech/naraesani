// Sound types
export enum SoundType {
  Correct = 'correct',
  Incorrect = 'incorrect',
  Success = 'success',
  Click = 'click',
}

// Sound file paths
const SOUND_PATHS: Record<SoundType, string> = {
  [SoundType.Correct]: '/sound/correct.mp3',
  [SoundType.Incorrect]: '/sound/incorrect.mp3',
  [SoundType.Success]: '/sound/success.mp3',
  [SoundType.Click]: '/sound/click.mp3',
};

// Play sound function
export const playSound = (soundType: SoundType): void => {
  try {
    const audio = new Audio(SOUND_PATHS[soundType]);
    audio.volume = 0.5;
    audio.play().catch((error) => {
      console.warn(`Failed to play sound: ${soundType}`, error);
    });
  } catch (error) {
    console.warn(`Error creating audio for sound: ${soundType}`, error);
  }
};
