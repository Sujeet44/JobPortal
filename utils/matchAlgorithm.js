const calculateMatch = (user, job) => {
  if (!user.skills || user.skills.length === 0) return 0;

  const userSkills = user.skills.map(skill => skill.toLowerCase().trim());
  const jobSkills = job.requiredSkills.map(skill => skill.toLowerCase().trim());

  const matchedSkills = jobSkills.filter(skill =>
    userSkills.includes(skill)
  );

  // ❗ Fix: if no skills match → return 0
  if (matchedSkills.length === 0) {
    return 0;
  }

  const skillMatchPercentage =
    (matchedSkills.length / jobSkills.length) * 100;

  let experienceScore = 0;

  if (user.experience >= job.minExperience) {
    experienceScore = 100;
  } else {
    experienceScore =
      (user.experience / job.minExperience) * 100;
  }

  const finalScore =
    (skillMatchPercentage * 0.7) +
    (experienceScore * 0.3);

  return Math.round(finalScore);
};

export default calculateMatch;