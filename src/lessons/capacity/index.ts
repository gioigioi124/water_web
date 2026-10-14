import lessonData from './lesson.json';
import itemsData from './items.json';
import levelsData from './levels.json';
import textViData from './text.vi.json';
import type { LessonConfig, ItemsData, LevelsData, TextDictionary } from '../../core/types';

export const capacityLesson: LessonConfig = lessonData as LessonConfig;
export const capacityItems: ItemsData = itemsData as unknown as ItemsData;
export const capacityLevels: LevelsData = levelsData as unknown as LevelsData;
export const capacityText: TextDictionary = textViData as unknown as TextDictionary;

export default {
  lesson: capacityLesson,
  items: capacityItems,
  levels: capacityLevels,
  text: capacityText,
};
