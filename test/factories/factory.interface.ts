export interface FactoryInterface<Model> {
  getInstance(): Promise<Model>;
}
