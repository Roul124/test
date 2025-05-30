class RK4SolverWithCache {
  constructor(x0, v0, gamma, omega0, h = 0.01) {
    this.history = [
      {
        t: 0,
        x: x0,
        v: v0,
      },
    ];
    this.x0 = x0;
    this.v0 = v0;
    this.currentStep = 0;
    this.h = h; // шаг по умолчанию
    (this.gamma = gamma), (this.omega0 = omega0);
  }

  // Система уравнений: dx/dt = v, dv/dt = -2γv - ω₀²x
  derivatives(x, v) {
    return {
      dx: v,
      dv: -2 * this.gamma * v - this.omega0 ** 2 * x,
    };
  }

  // Выполняет один шаг метода РК4
  step() {
    const last = this.history[this.currentStep];
    const { x, v, t } = last;

    const k1 = this.derivatives(x, v);
    const k2 = this.derivatives(
      x + (k1.dx * this.h) / 2,
      v + (k1.dv * this.h) / 2,
    );
    const k3 = this.derivatives(
      x + (k2.dx * this.h) / 2,
      v + (k2.dv * this.h) / 2,
    );
    const k4 = this.derivatives(x + k3.dx * this.h, v + k3.dv * this.h);

    const newX = x + ((k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx) * this.h) / 6;
    const newV = v + ((k1.dv + 2 * k2.dv + 2 * k3.dv + k4.dv) * this.h) / 6;
    const newT = t + this.h;

    this.history.push({
      t: newT,
      x: newX,
      v: newV,
    });
    this.currentStep++;

    return newX;
  }

  // Получает позицию для времени t, используя кэш
  getPosition(t, h = 0.01) {
    // Если запрошенный шаг отличается от текущего
    if (Math.abs(this.h - h) > 1e-6) {
      this.h = h;
      // Нужно пересчитать историю с новым шагом
      this.history = [this.history[0]];
      this.currentStep = 0;
    }

    // Если время меньше минимального в истории
    if (t <= this.history[0].t) return this.history[0];

    // Если время больше максимального в истории - продолжить вычисления
    while (this.history[this.currentStep].t < t) {
      this.step();
    }

    // Если время точно совпадает с одним из шагов
    const exactMatch = this.history.find(
      (point) => Math.abs(point.t - t) < 1e-6,
    );
    if (exactMatch) return exactMatch;

    // Линейная интерполяция между ближайшими точками
    for (let i = 1; i < this.history.length; i++) {
      if (this.history[i].t >= t) {
        const prev = this.history[i - 1];
        const curr = this.history[i];
        const alpha = (t - prev.t) / (curr.t - prev.t);
        return {
          x: prev.x + alpha * (curr.x - prev.x),
          v: prev.v + alpha * (curr.v - prev.v),
        };
      }
    }
    //console.log(this.history[this.currentStep]);
    return this.history[this.currentStep];
  }

  // Очищает кэш (например, при изменении параметров системы)
  clearCache() {
    this.history = [
      {
        t: 0,
        x: this.x0,
        v: this.v0,
      },
    ];
    this.currentStep = 0;
  }
}
