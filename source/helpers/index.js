import { returnMaxStars } from 'constants/defaultValues';

export function objectify(array) {
  const result = {};
  for (let elem of array) {
    result[elem.id] = elem;
  }
  return result;
}

export function scrollElementToCenter(element) {
  if (!element) return;
  let offsetTop = 0;
  const body = document
    ? document.scrollingElement || document.documentElement
    : {};
  addAllOffsetTop(element);
  body.scrollTop = offsetTop - (body.clientHeight - element.clientHeight) / 2;
  document.getElementById('App').scrollTop =
    offsetTop -
    (document.getElementById('App').clientHeight - element.clientHeight) / 2;
  function addAllOffsetTop(element) {
    offsetTop += element.offsetTop;
    if (element.offsetParent) {
      addAllOffsetTop(element.offsetParent);
    }
  }
}

export function textIsOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

export function determineXpButtonDisabled({
  difficulty,
  stars,
  myId,
  xpRewardInterfaceShown
}) {
  const maxStars = returnMaxStars({ difficulty });
  if (xpRewardInterfaceShown) return 'Reward';
  const numTotalStars = stars.reduce(
    (prev, star) => prev + star.rewardAmount,
    0
  );
  if (numTotalStars >= maxStars) return `${maxStars}/${maxStars} Twinkles`;
  const numPrevStars = stars.reduce((prev, star) => {
    if (star.rewarderId === myId) {
      return prev + star.rewardAmount;
    }
    return prev;
  }, 0);
  const maxRewardableStars = Math.ceil(maxStars / 2);
  if (numPrevStars >= maxRewardableStars) {
    return `${maxRewardableStars}/${maxRewardableStars} Rewarded`;
  }
  return false;
}