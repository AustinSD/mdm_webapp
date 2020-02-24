export class Device {
  id: string;
  status: string;
  release: string;
  model: string;
  enclave: Enclave[];
  key: string[];
  isSelected: boolean;
  wifi: boolean;
  user: string;
}

export class Enclave {
  name: string;
  status: string;
  pid: string;
}

export class AbeField {
  name: string;
  value: string;
  isSelected: boolean;
}
