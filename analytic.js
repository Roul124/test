function analyticalSolution(t, x0, v0, omega0, gamma) {
  const discriminant = gamma ** 2 - omega0 ** 2;

  // 1. Слабое демпфирование (γ < ω₀)
  if (discriminant < 0) {
    const omega = Math.sqrt(omega0 ** 2 - gamma ** 2);
    const A = x0;
    const B = (v0 + gamma * x0) / omega;
    return (
      Math.exp(-gamma * t) * (A * Math.cos(omega * t) + B * Math.sin(omega * t))
    );
  }
  // 2. Критическое демпфирование (γ = ω₀)
  else if (Math.abs(discriminant) < 1e-6) {
    const A = x0;
    const B = v0 + gamma * x0;
    return (A + B * t) * Math.exp(-gamma * t);
  }
  // 3. Сильное демпфирование (γ > ω₀)
  else {
    const sqrtD = Math.sqrt(discriminant);
    const r1 = -gamma + sqrtD;
    const r2 = -gamma - sqrtD;
    const A = (v0 - r2 * x0) / (r1 - r2);
    const B = (r1 * x0 - v0) / (r1 - r2);
    return A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
  }
}

function analyticalVelocity(t, x0, v0, omega0, gamma) {
  const discriminant = omega0 * omega0 - gamma * gamma;

  // Случай 1: Перезатухание (overdamped)
  if (discriminant < 0) {
    const beta = Math.sqrt(gamma * gamma - omega0 * omega0);
    const A = (v0 + (gamma + beta) * x0) / (2 * beta);
    const B = (v0 + (gamma - beta) * x0) / (-2 * beta);
    return (
      A * (gamma + beta) * Math.exp(-(gamma - beta) * t) +
      B * (gamma - beta) * Math.exp(-(gamma + beta) * t)
    );
  }

  // Случай 2: Критическое затухание (critically damped)
  if (discriminant === 0) {
    return Math.exp(-gamma * t) * (v0 - gamma * x0 * t);
  }

  // Случай 3: Слабое затухание (underdamped)
  const omega = Math.sqrt(discriminant);
  const A = x0;
  const B = (v0 + gamma * x0) / omega;
  return (
    Math.exp(-gamma * t) *
    (-gamma * (A * Math.cos(omega * t) + B * Math.sin(omega * t)) +
      omega * (-A * Math.sin(omega * t) + B * Math.cos(omega * t)))
  );
}
