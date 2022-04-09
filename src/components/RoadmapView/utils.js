export const scrollToToday = (smooth) => {
  const day = document.querySelector(".marker-day");
  day &&
    day.scrollIntoView &&
    day.scrollIntoView(
      smooth
        ? { behavior: "smooth", block: "center", inline: "start" }
        : { inline: "center" }
    );
};
