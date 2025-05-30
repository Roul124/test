class AdamsBashforthSolver {
  constructor(x0, v0, gamma, omega0) {
    // Инициализируем первые 3 точки методом РК4
    this.history = [];
    const rk4 = new RK4SolverWithCache(x0, v0, gamma, omega0);

    for (let i = 0; i < 3; i++) {
      const t = i * 0.1;
      const rk4solve = rk4.getPosition(t);
      const x = rk4solve.x;
      const v = rk4solve.v;
      this.history.push({ t, x, v });
    }

    (this.gamma = gamma), (this.omega0 = omega0);
  }

  derivatives(x, v) {
    return -2 * this.gamma * v - this.omega0 ** 2 * x;
  }

  getPosition(t, h = 0.01) {
    while (this.history[this.history.length - 1].t < t) {
      const last = this.history[this.history.length - 1];
      const prev1 = this.history[this.history.length - 2];
      const prev2 = this.history[this.history.length - 3];

      // Формула Адамса-Башфорта 3-го порядка:
      const f0 = this.derivatives(prev2.x, prev2.v);
      const f1 = this.derivatives(prev1.x, prev1.v);
      const f2 = this.derivatives(last.x, last.v);

      const newV = last.v + (h / 12) * (23 * f2 - 16 * f1 + 5 * f0);
      const newX =
        last.x + (h / 12) * (23 * last.v - 16 * prev1.v + 5 * prev2.v);

      this.history.push({
        t: last.t + h,
        x: newX,
        v: newV,
      });
    }

    // Интерполяция для точного времени
    return this.interpolate(t);
  }

  interpolate(t) {
    // Простая линейная интерполяция между ближайшими точками
    for (let i = 1; i < this.history.length; i++) {
      if (this.history[i].t >= t) {
        const prev = this.history[i - 1];
        const curr = this.history[i];
        const alpha = (t - prev.t) / (curr.t - prev.t);
        return prev.x + alpha * (curr.x - prev.x);
      }
    }
    return this.history[this.history.length - 1].x;
  }
}
