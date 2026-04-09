const intersectionCount = (a = [], b = []) => {
  const lower = new Set((a || []).map((item) => item.toLowerCase()));
  return (b || []).reduce((count, item) => (lower.has(item.toLowerCase()) ? count + 1 : count), 0);
};

const calculateMatchScore = (source, target) => {
  const skillOverlap = intersectionCount(source.skillsOffered, target.skillsWanted);
  const learningOverlap = intersectionCount(source.skillsWanted, target.skillsOffered);
  const experienceScore = source.experience && target.experience && source.experience === target.experience ? 10 : 4;

  return skillOverlap * 20 + learningOverlap * 20 + experienceScore;
};

module.exports = { calculateMatchScore };
