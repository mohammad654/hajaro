import { AnatomyView, MuscleId } from '../../core/models';
import { MuscleStore } from '../../core/data-access/muscle.store';

/** Chooses the anatomy view (front/back) that shows the most of the given muscles. */
export function preferredView(muscleIds: readonly MuscleId[], muscles: MuscleStore): AnatomyView {
  let front = 0;
  let back = 0;
  for (const id of muscleIds) {
    const views = muscles.get(id)?.views ?? [];
    if (views.includes('front')) front++;
    if (views.includes('back')) back++;
  }
  return back > front ? 'back' : 'front';
}
