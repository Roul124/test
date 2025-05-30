class HoinSolver {
  /**
   * Конструктор класса.
   * @param {number} x0 - Начальная координата
   * @param {number} v0 - Начальная скорость
   * @param {number} gamma - Коэффициент затухания
   * @param {number} omega0 - Собственная частота системы
   */
  constructor(x0, v0, gamma, omega0) {
    // Текущее состояние системы
    this.state = {
      t: 0, // Текущее время
      x: x0, // Текущая координата
      v: v0, // Текущая скорость
    };

    // Параметры системы
    this.gamma = gamma;
    this.omega0 = omega0;

    // История состояний (опционально)
    this.history = [this.state];
  }

  /**
   * Вычисление производных (правые части уравнений)
   * @returns {Object} - Производные dx/dt и dv/dt
   */
  derivatives() {
    const { x, v } = this.state;
    return {
      dx: v,
      dv: -2 * this.gamma * v - this.omega0 ** 2 * x,
    };
  }

  /**
   * Выполняет один шаг интегрирования методом Хойна
   * @param {number} h - Шаг интегрирования
   */
  step(h) {
    // Текущие значения
    const { x, v, t } = this.state;

    // Шаг 1: Вычисление производных в текущей точке
    const k1 = this.derivatives();

    // Шаг 2: Промежуточные значения (прогноз)
    const x_p = x + h * k1.dx;
    const v_p = v + h * k1.dv;

    // Шаг 3: Производные в промежуточной точке
    const k2 = {
      dx: v_p,
      dv: -2 * this.gamma * v_p - this.omega0 ** 2 * x_p,
    };

    // Шаг 4: Коррекция (усреднение производных)
    const newX = x + h * 0.5 * (k1.dx + k2.dx);
    const newV = v + h * 0.5 * (k1.dv + k2.dv);
    const newT = t + h;

    // Обновление состояния
    this.state = { t: newT, x: newX, v: newV };

    // Сохранение истории (опционально)
    this.history.push(this.state);
  }

  /**
   * Возвращает текущее состояние системы
   * @returns {Object} - {x, v, t}
   */
  getState() {
    return this.state;
  }

  /**
   * Вычисляет состояние системы в произвольный момент времени
   * @param {number} tTarget - Целевое время
   * @param {number} h - Шаг интегрирования
   */
  solveTo(tTarget, h = 0.01) {
    while (this.state.t < tTarget) {
      this.step(h);
    }
    return this.getState();
  }
}
