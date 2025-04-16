import behaviors from "../data/aba_behaviors.json";

export function getBehaviorOptions() {
  return behaviors.behaviors.map((item) => ({
    label: item.name,
    value: item.name,
    categoria: item.category,
    funcion: item.function,
  }));
}
