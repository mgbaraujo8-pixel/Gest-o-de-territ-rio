export interface Visit {
  id: number;
  equipmentId: number;
  date: string;
  ageGroups: string[]; // ['Criança', 'Adolescente', 'Adulto', 'Idoso']
  objectives: string[]; // ['Articulação e fortalecimento da rede', 'Mapeamento territorial', 'Alinhamento de fluxos de encaminhamento', 'Identificação de parcerias intersetoriais', 'Outro']
  otherObjective?: string;
  synthesis: string;
  professional: string; // 'Natalia Rocha', 'Luciana Matias'
  intern?: string; // 'Monaliza Oliveira', 'Gabriela Souza'
}

export interface Referral {
  id: number;
  personName: string;
  targetEquipmentId: number;
  date: string;
  professional: string;
  reason: string;
  status: 'Ativo' | 'Concluído';
}

export interface Equipment {
  id: number;
  name: string;
  policy: string;
  type: string;
  address: string;
  neighborhood: string;
  coords: [number, number];
  organ: string;
  contact?: string;
  reference?: string;
  observations?: string;
}

export const allEquipments: Equipment[] = [
  { id: 1, name: "Conselho Tutelar III", policy: "Proteção Social", type: "Conselho Tutelar", address: "R. Silveira Filho, 935", neighborhood: "João XXIII", coords: [-3.7728, -38.5785], organ: "FUNCI" },
  { id: 2, name: "Secretária Executiva Regional 11", policy: "Gestão", type: "Secretaria Executiva", address: "R. Rio Grande do Sul, 860", neighborhood: "Panamericano", coords: [-3.7567, -38.5647], organ: "SEGER" },
  { id: 3, name: "UAPS Cícera Carla Almeida", policy: "Saúde", type: "UBS", address: "R. Júlio Braga, 1331", neighborhood: "Bonsucesso", coords: [-3.7732, -38.5832], organ: "SMS" },
  { id: 4, name: "UPAS César Cals de Oliveira Filho", policy: "Saúde", type: "UBS", address: "R. Pernambuco, 3172", neighborhood: "Pici", coords: [-3.7478, -38.5808], organ: "SMS" },
  { id: 5, name: "UPAS Eliézer Studart", policy: "Saúde", type: "UBS", address: "R. Tomás Cavalcante, 545", neighborhood: "Autran Nunes", coords: [-3.7545, -38.5956], organ: "SMS" },
  { id: 6, name: "UPAS Senador Fernandes Távora", policy: "Saúde", type: "UBS", address: "R. Maceió, 1354", neighborhood: "Henrique Jorge", coords: [-3.7634, -38.5907], organ: "SMS" },
  { id: 7, name: "UPAS Francisco Pereira de Almeida", policy: "Saúde", type: "UBS", address: "R. José Freitas da Silva, 359", neighborhood: "Pici", coords: [-3.7476, -38.5669], organ: "SMS" },
  { id: 8, name: "UPAS Prof. Luiz Recamonde Capelo", policy: "Saúde", type: "UBS", address: "R. Maria Quintela, 935", neighborhood: "Bonsucesso", coords: [-3.7721, -38.5893], organ: "SMS" },
  { id: 9, name: "UPAS Mariusa Silva de Sousa", policy: "Saúde", type: "UBS", address: "R. Araçá, 440", neighborhood: "Bonsucesso", coords: [-3.7813, -38.5840], organ: "SMS" },
  { id: 10, name: "UPAS José Sobreira de Amorim", policy: "Saúde", type: "UBS", address: "Rua Des. Luís Paulino, 109", neighborhood: "Jóquei Clube", coords: [-3.7627, -38.5794], organ: "SMS" },
  { id: 11, name: "UPAS Waldemar Alcântara", policy: "Saúde", type: "UBS", address: "R. Silveira Filho, 903", neighborhood: "Jóquei Clube", coords: [-3.7662, -38.5770], organ: "SMS" },
  { id: 12, name: "UPAS Gilmário Mourão Teixeira", policy: "Saúde", type: "UBS", address: "R. Pernambuco, 1674", neighborhood: "Pici", coords: [-3.7565, -38.5724], organ: "SMS" },
  { id: 13, name: "Policlínica Dr. Lusmar Veras Rodrigues", policy: "Saúde", type: "Policlínica", address: "Av. Carneiro de Mendonça", neighborhood: "Jóquei Clube", coords: [-3.7610, -38.5726], organ: "SMS" },
  { id: 14, name: "Policlínica Dr. José Eloy da Costa Filho", policy: "Saúde", type: "Policlínica", address: "Av. Augusto dos Anjos, 2466", neighborhood: "Bonsucesso", coords: [-3.7871, -38.5857], organ: "SMS" },
  { id: 15, name: "Hospital da Mulher de Fortaleza", policy: "Saúde", type: "Hospital", address: "R. George Rocha, 50", neighborhood: "Demócrito Rocha", coords: [-3.7621, -38.5727], organ: "SMS" },
  { id: 16, name: "Hospital Infantil de Fortaleza", policy: "Saúde", type: "Hospital", address: "Av. Lineu Machado, 155", neighborhood: "Jóquei Clube", coords: [-3.7623, -38.5748], organ: "SMS" },
  { id: 17, name: "Instituto de Nefrologia do Ceará", policy: "Saúde", type: "Hospital", address: "Av. Lineu Machado, 72", neighborhood: "Jóquei Clube", coords: [-3.7591, -38.5751], organ: "SMS" },
  { id: 18, name: "Instituto de Prevenção do Câncer", policy: "Saúde", type: "Hospital", address: "R. Walter Bezerra de Sá, 58", neighborhood: "Rodolfo Teófilo", coords: [-3.7441, -38.5509], organ: "SESA" },
  { id: 19, name: "CRAS Bela Vista", policy: "Assistência Social", type: "CRAS", address: "Rua Mário de Andrade, 496 A", neighborhood: "Bela Vista", coords: [-3.7516, -38.5604], organ: "SDHDS" },
  { id: 20, name: "CRAS João XXIII", policy: "Assistência Social", type: "CRAS", address: "R. Visc. de Cauípe, 200", neighborhood: "João XXIII", coords: [-3.7719, -38.5812], organ: "SDHDS" },
  { id: 21, name: "CRAS Genibaú", policy: "Assistência Social", type: "CRAS", address: "R. 1107 - Conjunto Ceará I", neighborhood: "Genibaú", coords: [-3.7899, -38.6106], organ: "SDHDS" },
  { id: 22, name: "CRAS Granja Portugal", policy: "Assistência Social", type: "CRAS", address: "R. Humberto Lomeu, 1130", neighborhood: "Granja Portugal", coords: [-3.7817, -38.6019], organ: "SDHDS" },
  { id: 23, name: "Creas Rodolfo Teófilo", policy: "Assistência Social", type: "CREAS", address: "Rua Dom Lino, 1001", neighborhood: "Rodolfo Teófilo", coords: [-3.7421, -38.5554], organ: "SDHDS" },
  { id: 24, name: "CAPS Infantil Regional 3", policy: "Saúde", type: "CAPS", address: "R. Porfírio Sampaio, 1905", neighborhood: "Rodolfo Teófilo", coords: [-3.7405, -38.5505], organ: "SMS" },
  { id: 25, name: "CAPs - Centro de Apoio Psicossocial", policy: "Saúde", type: "CAPS", address: "R. Pastor Samuel Munguba, 1269", neighborhood: "Rodolfo Teófilo", coords: [-3.7492, -38.5508], organ: "SMS" },
  { id: 26, name: "CAPS AD FORTALEZA SER III", policy: "Saúde", type: "CAPS", address: "R. Papi Júnior, 1221", neighborhood: "Rodolfo Teófilo", coords: [-3.7475, -38.5530], organ: "SMS" },
  { id: 27, name: "AA Grupo Henrique Jorge", policy: "Terceiro Setor", type: "Associação", address: "R. Luciano Queiroz, 590", neighborhood: "Henrique Jorge", coords: [-3.7625, -38.5813], organ: "SMS" },
  { id: 28, name: "AA Grupo João XXIII", policy: "Terceiro Setor", type: "Associação", address: "R. Melo de Oliveira, 975", neighborhood: "João XXIII", coords: [-3.7737, -38.5788], organ: "SMS" },
  { id: 29, name: "Casa da Criança e do Adolescente", policy: "Proteção Social", type: "CCA", address: "Rua Capitão Melo, 3883", neighborhood: "São João do Tauape", coords: [-3.7562, -38.5130], organ: "SPS" },
  { id: 30, name: "Centro de Diagnóstico Espaço Girassol", policy: "Proteção Social", type: "Secretaria Executiva", address: "Rua Juraci Mendes Oliveira, 01", neighborhood: "Edson Queiroz", coords: [-3.7580, -38.4817], organ: "SMS" },
  { id: 31, name: "Casa da Mulher Brasileira do Ceará", policy: "Direitos da Mulher", type: "Delegacia", address: "R. Tabuleiro do Norte, sn", neighborhood: "Couto Fernandes", coords: [-3.7575, -38.5596], organ: "SMC" },
  { id: 32, name: "Secretaria da Igualdade Racial", policy: "Igualdade Racial", type: "Secretaria Executiva", address: "R. Silva Paulet, 334", neighborhood: "Meireles", coords: [-3.7271, -38.5032], organ: "SEIR" },
  { id: 33, name: "Centro de Referência LGBT Janaína Dutra", policy: "População LGBTQIA+", type: "Secretaria Executiva", address: "R. Jaime Benévolo, 21", neighborhood: "Centro", coords: [-3.7323, -38.5255], organ: "SEDIV" },
  { id: 34, name: "Centro Estadual de Referência LGBT+", policy: "População LGBTQIA+", type: "Secretaria Executiva", address: "R. Valdetário Mota, 970", neighborhood: "Papicu", coords: [-3.7378, -38.4817], organ: "SEDIV" },
  { id: 35, name: "Defensoria Pública - João XXIII", policy: "Acesso à Justiça", type: "Defensoria Pública", address: "R. Júlio Braga, 1281", neighborhood: "João XXIII", coords: [-3.7748, -38.5815], organ: "DPCE" },
  { id: 36, name: "CUCA Pici", policy: "Cultura", type: "CUCA", address: "R. Cel. Matos Dourado, 1499", neighborhood: "Pici", coords: [-3.7523, -38.5822], organ: "SEJUV" },
  { id: 37, name: "Biblioteca Cristina Poeta", policy: "Cultura", type: "Biblioteca", address: "R. Raimundo Ribeiro, 580", neighborhood: "Autran Nunes", coords: [-3.7548, -38.5953], organ: "SECULT CE" },
  { id: 38, name: "ICA - Instituto de Cultura e Arte - UFC", policy: "Cultura", type: "Museu", address: "R. Prof. Armando Farias", neighborhood: "Pici", coords: [-3.7459, -38.5717], organ: "UFC" },
  { id: 39, name: "CEI Prof. José Sobreira de Amorim", policy: "Educação", type: "Creche", address: "Rua Estrada do Pici, 1083", neighborhood: "Henrique Jorge", coords: [-3.7648, -38.5784], organ: "SME" },
  { id: 40, name: "CEI DOM JOSÉ TUPINAMBÁ DA FROTA", policy: "Educação", type: "Creche", address: "R. Três de Maio, 948", neighborhood: "Bela Vista", coords: [-3.7503, -38.5629], organ: "SME" },
  { id: 41, name: "CEI Francisco Eurivá Matias", policy: "Educação", type: "Creche", address: "R. Frei Marcelino, s/n", neighborhood: "Rodolfo Teófilo", coords: [-3.7451, -38.5541], organ: "SME" },
  { id: 42, name: "CEI Abraão Lucca da Silva Costa", policy: "Educação", type: "Creche", address: "Rua Professor Miramar da Ponte, 12", neighborhood: "Henrique Jorge", coords: [-3.7534, -38.5816], organ: "SME" },
  { id: 43, name: "CEI LUZIE TORQUATO DA COSTA", policy: "Educação", type: "Creche", address: "Rua Raimundo Ribeiro, s/n", neighborhood: "Autran Nunes", coords: [-3.7547, -38.5952], organ: "SME" },
  { id: 44, name: "CEI Maria Terezinha de Carvalho Holanda", policy: "Educação", type: "Creche", address: "Av. I, S/N", neighborhood: "Parque Genibaú", coords: [-3.7678, -38.5969], organ: "SME" },
  { id: 45, name: "CEI Murilo Aguiar", policy: "Educação", type: "Creche", address: "Rua 24 de Outubro, 1063", neighborhood: "Parque Genibaú", coords: [-3.7556, -38.6033], organ: "SME" },
  { id: 46, name: "Escola Municipal Presidente Kennedy", policy: "Educação", type: "Escola", address: "Av. Lineu Machado, 877", neighborhood: "Jóquei Clube", coords: [-3.7676, -38.5778], organ: "SME" },
  { id: 47, name: "EEM Heráclito de Castro e Silva", policy: "Educação", type: "Escola", address: "Rua Araripe Macêdo, 354", neighborhood: "Jóquei Clube", coords: [-3.7717, -38.5772], organ: "SMS" },
  { id: 48, name: "Escola Municipal Adroaldo Teixeira Castelo", policy: "Educação", type: "Escola", address: "R. Alagoas, 2267", neighborhood: "Pici", coords: [-3.7547, -38.5752], organ: "SME" },
  { id: 49, name: "EEMTI Antonieta Siqueira", policy: "Educação", type: "Escola", address: "Rua Guarani, 4", neighborhood: "Pici", coords: [-3.7573, -38.5775], organ: "SME" },
  { id: 50, name: "EMEIEF José Bonifácio de Sousa", policy: "Educação", type: "Escola", address: "R. Pernambuco, 600", neighborhood: "Pici", coords: [-3.7575, -38.5718], organ: "SME" },
  { id: 51, name: "EMEIF Profa. Liduina Correia Leite", policy: "Educação", type: "Escola", address: "R. Fernão Magalhães, 120", neighborhood: "Pici", coords: [-3.7488, -38.5696], organ: "SME" },
  { id: 52, name: "EEEP Júlia Giffoni", policy: "Educação", type: "Escola", address: "R. Cel. Matos Dourado, 1349", neighborhood: "Pici", coords: [-3.7483, -38.5844], organ: "SME" },
  { id: 53, name: "EMEF Nilson Holanda", policy: "Educação", type: "Escola", address: "R. Viriato Ribeiro, 890", neighborhood: "Bela Vista", coords: [-3.7491, -38.5618], organ: "SME" },
  { id: 54, name: "EMTI Prof. José Júlio da Ponte", policy: "Educação", type: "Escola", address: "Rua Mário de Andrade, s/n", neighborhood: "Bela Vista", coords: [-3.7498, -38.5621], organ: "SME" },
  { id: 55, name: "EEMTI Estado do Amazonas", policy: "Educação", type: "Escola", address: "Rua Monsenhor Furtado, 2327", neighborhood: "Panamericano", coords: [-3.7557, -38.5578], organ: "SME" },
  { id: 56, name: "EMEIF Dom José Tupinambá da Frota", policy: "Educação", type: "Escola", address: "R. Viriato Ribeiro, 1031", neighborhood: "Bela Vista", coords: [-3.7493, -38.5622], organ: "SME" },
  { id: 57, name: "Escola Municipal Nauri Braga", policy: "Educação", type: "Escola", address: "R. Lilian Abreu, 231", neighborhood: "Bela Vista", coords: [-3.7495, -38.5671], organ: "SME" },
  { id: 58, name: "EMEIEF José Batista de Oliveira", policy: "Educação", type: "Escola", address: "R. Goiás, S/N", neighborhood: "Panamericano", coords: [-3.7573, -38.5653], organ: "SME" },
  { id: 59, name: "EEFM Joaquim Alves", policy: "Educação", type: "Escola", address: "R. Estado do Rio, 955", neighborhood: "Panamericano", coords: [-3.7589, -38.5710], organ: "SME" },
  { id: 60, name: "EMEIEF Paulo Sarasate", policy: "Educação", type: "Escola", address: "R. Pedro Muniz, 250", neighborhood: "Panamericano", coords: [-3.7640, -38.5631], organ: "SME" },
  { id: 61, name: "EEFM Anísio Teixeira", policy: "Educação", type: "Escola", address: "R Rio Grande do Sul, 680", neighborhood: "Panamericano", coords: [-3.7545, -38.5652], organ: "SME" },
  { id: 62, name: "EMEIEF São Raimundo", policy: "Educação", type: "Escola", address: "R. Alexandre Baraúna, 1450", neighborhood: "Rodolfo Teófilo", coords: [-3.7452, -38.5543], organ: "SME" },
  { id: 63, name: "Escola Municipal Antônio Sales", policy: "Educação", type: "Escola", address: "R. Taváres Iracema, 675", neighborhood: "Rodolfo Teófilo", coords: [-3.7483, -38.5572], organ: "SME" },
  { id: 64, name: "EEMTI Senador Fernandes Távora", policy: "Educação", type: "Escola", address: "R. Goiás, 141", neighborhood: "Panamericano", coords: [-3.7607, -38.5676], organ: "SME" },
  { id: 65, name: "EMTI Francisca Fernandes Magalhães", policy: "Educação", type: "Escola", address: "R. Vital Brasil, 1020", neighborhood: "Bonsucesso", coords: [-3.7796, -38.5898], organ: "SME" },
  { id: 66, name: "EMEIEF Autran Nunes", policy: "Educação", type: "Escola", address: "R. Prof. Virgílio de Morais, S/N", neighborhood: "Autran Nunes", coords: [-3.7493, -38.5957], organ: "SME" },
  { id: 67, name: "EMEF Murilo Serpa", policy: "Educação", type: "Escola", address: "Rua Monsenhor Hipólito Brasil, 1400", neighborhood: "Dom Lustosa", coords: [-3.7407, -38.5847], organ: "SME" },
  { id: 68, name: "EMEIEF Santa Luzia", policy: "Educação", type: "Escola", address: "Rua Coronel Francisco Bento, 16", neighborhood: "Dom Lustosa", coords: [-3.7277, -38.5860], organ: "SME" },
  { id: 69, name: "EEMTI Ayrton Senna da Silva", policy: "Educação", type: "Escola", address: "R. Manaus, 855", neighborhood: "Dom Lustosa", coords: [-3.7387, -38.5915], organ: "SME" },
  { id: 70, name: "CAIC Raimundo Gomes de Carvalho", policy: "Educação", type: "Escola", address: "R. Prof. Edgard de Arruda, 1683", neighborhood: "Dom Lustosa", coords: [-3.7553, -38.5900], organ: "SME" },
  { id: 71, name: "Escola Municipal Santa Maria", policy: "Educação", type: "Escola", address: "R. Cuiabá, 1465", neighborhood: "Henrique Jorge", coords: [-3.7642, -38.5877], organ: "SME" },
  { id: 72, name: "E.E.E.M. Mariano Martins", policy: "Educação", type: "Escola", address: "Av. Senador Fernandes Távora, 1445", neighborhood: "Henrique Jorge", coords: [-3.7603, -38.5855], organ: "SME" },
  { id: 73, name: "EEMTI Professor Paulo Freire", policy: "Educação", type: "Escola", address: "Av. Senador Fernandes Távora, 1936", neighborhood: "Henrique Jorge", coords: [-3.7580, -38.5891], organ: "SME" },
  { id: 74, name: "EEM João Paulo II", policy: "Educação", type: "Escola", address: "R. Prof. Heribaldo Costa, 1125", neighborhood: "Henrique Jorge", coords: [-3.7624, -38.5851], organ: "SME" },
  { id: 75, name: "EMEIEF José Waldemar de Alcântara e Silva", policy: "Educação", type: "Escola", address: "R. Maceió, 627", neighborhood: "Henrique Jorge", coords: [-3.7574, -38.5871], organ: "SME" },
  { id: 76, name: "EMEIEF Dona Dagmar Gentil", policy: "Educação", type: "Escola", address: "R. Vitória, 1750", neighborhood: "João XXIII", coords: [-3.7677, -38.5901], organ: "SME" },
  { id: 77, name: "Escola Municipal 15 de Outubro", policy: "Educação", type: "Escola", address: "R. Joaquim Manuel de Macêdo, 2125", neighborhood: "João XXIII", coords: [-3.7705, -38.5884], organ: "SME" },
  { id: 78, name: "EMEIEF João Paulo I", policy: "Educação", type: "Escola", address: "R. Luís de Castro, 254", neighborhood: "Bonsucesso", coords: [-3.7764, -38.5777], organ: "SME" },
  { id: 79, name: "EMEF José Alcides Pinto", policy: "Educação", type: "Escola", address: "Rua Guarani, 2000", neighborhood: "Bonsucesso", coords: [-3.7742, -38.5858], organ: "SME" },
  { id: 80, name: "EMEIEF Prof. Luiz Recamonde Capelo", policy: "Educação", type: "Escola", address: "R. Maria Quintela, 902", neighborhood: "Bonsucesso", coords: [-3.7753, -38.5881], organ: "SME" },
  { id: 81, name: "EEFM São José do Pici das Pedreiras", policy: "Educação", type: "Escola", address: "R. Manoel Antônio Leite, 250", neighborhood: "Bonsucesso", coords: [-3.7733, -38.5923], organ: "SME" },
  { id: 82, name: "EMEIEF Irmã Dulce", policy: "Educação", type: "Escola", address: "R. Manoel Antônio Leite, 703", neighborhood: "Bonsucesso", coords: [-3.8787, -3.8642], organ: "SME" },
  { id: 83, name: "ESCOLA ARENINHA PRAÇA DA JUVENTUDE", policy: "Educação", type: "Escola", address: "Tv. Rio de Janeiro, 462", neighborhood: "Bonsucesso", coords: [-3.7691, -38.5917], organ: "SME" },
  { id: 84, name: "EMEIF Antônio Diogo de Siqueira", policy: "Educação", type: "Escola", address: "R. Anselmo Nogueira, 655", neighborhood: "Bonsucesso", coords: [-3.7837, -38.5879], organ: "SME" },
  { id: 85, name: "EMEIEF Irmã Maria Evanete", policy: "Educação", type: "Escola", address: "Av. D, 1015", neighborhood: "Parque Genibaú", coords: [-3.7606, -38.6032], organ: "SME" },
  { id: 86, name: "Escola Municipal João Frederico Ferreira Gomes", policy: "Educação", type: "Escola", address: "R. José Mendonça, 1150", neighborhood: "Parque Genibaú", coords: [-3.7533, -38.6014], organ: "SME" },
  { id: 87, name: "EEM Liceu do Conjunto Ceará", policy: "Educação", type: "Escola", address: "R. 1139 A, 10", neighborhood: "Conjunto Ceará I e II", coords: [-3.7582, -38.6100], organ: "SME" },
  { id: 88, name: "EMEIEF João Paulo II", policy: "Educação", type: "Escola", address: "Av. C, 1381", neighborhood: "Conjunto Ceará II", coords: [-3.7703, -38.6137], organ: "SME" },
  { id: 89, name: "EEM Dr. Ubirajara Índio do Ceará", policy: "Educação", type: "Escola", address: "Rua Setecentos E Cinquenta E Um, S/N", neighborhood: "Conjunto Ceará I e II", coords: [-3.7739, -38.6012], organ: "SME" },
  { id: 90, name: "EEMTI Professora Maria Antonieta Nunes", policy: "Educação", type: "Escola", address: "R. 916, 01", neighborhood: "Conjunto Ceará II", coords: [-3.7744, -38.6179], organ: "SME" },
  { id: 91, name: "EMTI Prof. Ademar Nunes Batista", policy: "Educação", type: "Escola", address: "1159, 100", neighborhood: "Conjunto Ceará I e II", coords: [-3.7622, -38.6119], organ: "SME" },
  { id: 92, name: "EMEIF Padre Arimateia Diniz", policy: "Educação", type: "Escola", address: "R. 814, s/n", neighborhood: "Conjunto Ceará I e II", coords: [-3.7683, -38.5991], organ: "SME" },
  { id: 93, name: "EEM Doutor Gentil Barreira", policy: "Educação", type: "Escola", address: "Rua 202 - D, S/N", neighborhood: "Conjunto Ceará I e II", coords: [-3.7649, -38.6081], organ: "SME" },
  { id: 94, name: "EMEIEF São Raimundo", policy: "Educação", type: "Escola", address: "R. Alexandre Baraúna, 1450", neighborhood: "Rodolfo Teófilo", coords: [-3.7453, -38.5544], organ: "SME" },
  { id: 95, name: "EEFM Félix de Azevedo", policy: "Educação", type: "Escola", address: "Rua Monsenhor Furtado, 757", neighborhood: "Rodolfo Teófilo", coords: [-3.7454, -38.5486], organ: "SME" },
  { id: 96, name: "Micro Parque Santa Luzia", policy: "Esporte e Lazer", type: "Parque", address: "R. 1002", neighborhood: "Conjunto Ceará II", coords: [-3.7731, -38.6189], organ: "SEUMA" },
  { id: 97, name: "Microparque Aconchego", policy: "Esporte e Lazer", type: "Parque", address: "R. 218 B", neighborhood: "Conjunto Ceará I", coords: [-3.7644, -38.6074], organ: "SEUMA" },
  { id: 98, name: "Areninha Rodolfo Teófilo", policy: "Esporte e Lazer", type: "Areninha", address: "R. Francisca Clotilde, S/N", neighborhood: "Rodolfo Teófilo", coords: [-3.7475, -38.5569], organ: "SECEL" },
  { id: 99, name: "Areninha Campo do Tigrão", policy: "Esporte e Lazer", type: "Areninha", address: "R. Cândido Jucá, 419", neighborhood: "Rodolfo Teófilo", coords: [-3.7417, -38.5457], organ: "SECEL" },
  { id: 100, name: "Delegacia de Defesa da Mulher", policy: "Acesso à Justiça", type: "Delegacia", address: "R. Tabuleiro do Norte, s/n", neighborhood: "Couto Fernandes", coords: [-3.7448, -38.5599], organ: "SMC" },
  { id: 101, name: "FUNCI", policy: "Acesso à Justiça", type: "Secretaria Executiva", address: "R. Jaime Benévolo, 21", neighborhood: "Centro", coords: [-3.7323, -38.5255], organ: "FUNCI" },
  { id: 102, name: "SSPDS/CE", policy: "Acesso à Justiça", type: "Secretaria Executiva", address: "Av. Aguanambi", neighborhood: "Aeroporto", coords: [-3.7588, -38.5243], organ: "SSPDS" },
  { id: 103, name: "Defesa Civil de Fortaleza", policy: "Acesso à Justiça", type: "Secretaria Executiva", address: "R. Guilherme Rocha, 1342", neighborhood: "Centro", coords: [-3.7231, -38.5380], organ: "Prefeitura" },
  { id: 104, name: "CISFOR", policy: "Acesso à Justiça", type: "Ouvidoria", address: "Av. Jovita Feitosa, 1264", neighborhood: "Parquelândia", coords: [-3.7392, -38.5561], organ: "Prefeitura" },
  { id: 105, name: "Rede de Catadores", policy: "Terceiro Setor", type: "OSC", address: "R. Rômulo Bezerra, sn", neighborhood: "João XXIII", coords: [-3.7703, -38.5930], organ: "Associação" },
  { id: 106, name: "INTRA", policy: "Terceiro Setor", type: "Instituto", address: "R. 1159, 9-5", neighborhood: "Conjunto Ceará I", coords: [-3.7619, -38.6114], organ: "Privado" },
  { id: 107, name: "Instituto Maria da Hora", policy: "Terceiro Setor", type: "OSC", address: "R. Cel. Matos Dourado, 397", neighborhood: "Henrique Jorge", coords: [-3.7562, -38.5835], organ: "Privado" },
  { id: 108, name: "ACMBHJ", policy: "Terceiro Setor", type: "Associação", address: "Av. Audízio Pinheiro, 1520", neighborhood: "Henrique Jorge", coords: [-3.7639, -38.5919], organ: "Comunidade" },
  { id: 109, name: "CONSELHOS DOS MORADORES DO JOAO XXIII", policy: "Terceiro Setor", type: "Associação", address: "Rua Desembargador Félix Cândido", neighborhood: "João XXIII", coords: [-3.7741, -38.5807], organ: "Comunidade" },
  { id: 110, name: "Instito Mão Amiga", policy: "Terceiro Setor", type: "Associação", address: "R. Padre Sá Leitão, 383", neighborhood: "Jóquei Clube", coords: [-3.7599, -38.5803], organ: "Comunidade" },
  { id: 111, name: "Amocap", policy: "Terceiro Setor", type: "Associação", address: "Rua 2 de Maio, 456", neighborhood: "Pici", coords: [-3.7516, -38.5787], organ: "Comunidade" },
  { id: 112, name: "Associação Beneficente do Centrinho", policy: "Terceiro Setor", type: "OSC", address: "R. 1096, 15", neighborhood: "Conjunto Ceará II", coords: [-3.7723, -38.6169], organ: "Comunidade" },
  { id: 113, name: "GEEON", policy: "Terceiro Setor", type: "Instituto", address: "R. Papi Júnior, 1511", neighborhood: "Bela Vista", coords: [-3.7496, -38.5552], organ: "Privado" },
  { id: 114, name: "Grupo Bailarinos de Cristo", policy: "Terceiro Setor", type: "ONG", address: "R. Paraná, 3", neighborhood: "Bela Vista", coords: [-3.7507, -38.5642], organ: "Privado" },
  { id: 115, name: "ADEP", policy: "Terceiro Setor", type: "Associação", address: "Rua Planalto do Pici, 1745", neighborhood: "Pici", coords: [-3.7496, -38.5828], organ: "Comunidade" },
  { id: 116, name: "IDESC", policy: "Terceiro Setor", type: "OSC", address: "R. Dra. Sara Mesquita, 1728", neighborhood: "Pici", coords: [-3.7495, -38.5828], organ: "Privado" },
  { id: 117, name: "ABEP", policy: "Terceiro Setor", type: "OSC", address: "Rua Guanabara, 128", neighborhood: "Panamericano", coords: [-3.7522, -38.5662], organ: "Comunidade" },
  { id: 118, name: "ONG Social em Ação", policy: "Terceiro Setor", type: "ONG", address: "R. Luís de Castro, 17", neighborhood: "João XXIII", coords: [-3.7747, -38.5772], organ: "Comunidade" },
  { id: 119, name: "Núcleo de Mediação Comunitária", policy: "Terceiro Setor", type: "Núcleo", address: "R. Júlio Braga, 161", neighborhood: "Parangaba", coords: [-3.7808, -38.5727], organ: "MP" },
  { id: 120, name: "Associação Marília Mulher", policy: "Terceiro Setor", type: "Associação", address: "R. Peru, 1220", neighborhood: "Parangaba", coords: [-3.7765, -38.5528], organ: "Comunidade" },
  { id: 121, name: "Instituto dos Olhos do Ceará", policy: "Terceiro Setor", type: "Instituto", address: "Rua 444, 42", neighborhood: "Conjunto Ceará I", coords: [-3.7623, -38.6054], organ: "Privado" },
  { id: 122, name: "Instituto Seara Viva", policy: "Terceiro Setor", type: "Instituto", address: "R. 832, 35", neighborhood: "Conjunto Ceará I", coords: [-3.7682, -38.6035], organ: "Privado" },
  { id: 123, name: "CEJA Adelino Alcântara Filho", policy: "Educação", type: "Escola", address: "R. 612, S/N", neighborhood: "Conjunto Ceará I", coords: [-3.7649, -38.6029], organ: "SME" },
  { id: 124, name: "Liceu do Conjunto Ceará", policy: "Educação", type: "Escola", address: "R. 1139 A, 10", neighborhood: "Conjunto Ceará I", coords: [-3.7581, -38.6099], organ: "SME" },
  { id: 125, name: "CCDH Conjunto Ceará", policy: "Esporte e Lazer", type: "Associação", address: "Av. Alanis Maria Laurindo de Oliveira, 461", neighborhood: "Conjunto Ceará I", coords: [-3.7658, -38.6054], organ: "SECULT CE" },
  { id: 126, name: "Projeto Trampolim", policy: "Terceiro Setor", type: "OSC", address: "R. Xavier de Oliveira, 52", neighborhood: "Amadeu Furtado", coords: [-3.7465, -38.5579], organ: "Privado" },
  { id: 127, name: "AFECE", policy: "Terceiro Setor", type: "Associação", address: "Rodolfo Teófilo", neighborhood: "Rodolfo Teófilo", coords: [-3.7447, -38.5456], organ: "Privado" },
  { id: 128, name: "Casa Vida", policy: "Terceiro Setor", type: "Instituto", address: "Rua Papi Junior, 1222", neighborhood: "Rodolfo Teófilo", coords: [-3.7448, -38.5519], organ: "Privado" },
  { id: 129, name: "Instituto Maranguapinho", policy: "Terceiro Setor", type: "Instituto", address: "Rua das Pedrinhas, 832", neighborhood: "Parque Genibaú", coords: [-3.7597, -38.5997], organ: "Privado" },
  { id: 130, name: "Associação dos Moradores do Parque Genibaú", policy: "Terceiro Setor", type: "Associação", address: "R. Muritinga, 218", neighborhood: "Parque Genibaú", coords: [-3.7462, -38.5997], organ: "Comunidade" },
  { id: 131, name: "Instituto de Mulheres em Ação", policy: "Terceiro Setor", type: "Instituto", address: "R. Boa Vista, 1208", neighborhood: "João XXIII", coords: [-3.7659, -38.5914], organ: "Comunidade" },
  { id: 132, name: "Agacc", policy: "Terceiro Setor", type: "Associação", address: "Av. Visconde do Rio Branco, 2847", neighborhood: "Piedade", coords: [-3.7457, -38.5219], organ: "Comunidade" },
  { id: 133, name: "Projeto Arte e Cor", policy: "Terceiro Setor", type: "Instituto", address: "Rua Desembargador Felismino, 219", neighborhood: "Autran Nunes", coords: [-3.7500, -38.5971], organ: "Comunidade" },
  { id: 134, name: "ABEP - Pan-Americano", policy: "Terceiro Setor", type: "Associação", address: "R. Guanabara, 128", neighborhood: "Demócrito Rocha", coords: [-3.7521, -38.5663], organ: "Comunidade" },
  { id: 135, name: "Associação Comunitária É tempo de Vencer", policy: "Terceiro Setor", type: "Associação", address: "Praça Mauá", neighborhood: "Panamericano", coords: [-3.7550, -38.5678], organ: "Comunidade" },
  { id: 136, name: "AEDR", policy: "Terceiro Setor", type: "Associação", address: "R Rio Grande do Norte, 1014", neighborhood: "Demócrito Rocha", coords: [-3.7588, -38.5671], organ: "Comunidade" },
  { id: 137, name: "SINE Municipal - Bonsucesso", policy: "Trabalho", type: "Qualificação", address: "Av. Augusto dos Anjos, 2458", neighborhood: "Bonsucesso", coords: [-3.7868, -38.5854], organ: "SDE" },
  { id: 138, name: "SENAI Parangaba", policy: "Trabalho", type: "Qualificação", address: "Av. João Pessoa, 6760", neighborhood: "Parangaba", coords: [-3.7684, -38.5615], organ: "SDE" },
  { id: 139, name: "SDE", policy: "Trabalho", type: "Qualificação", address: "R. Des. Leite Albuquerque, 1233", neighborhood: "Aldeota", coords: [-3.7337, -38.5023], organ: "SDE" },
  { id: 140, name: "Centec", policy: "Trabalho", type: "Qualificação", address: "R.Silva Jardim, 515", neighborhood: "Centro", coords: [-3.7418, -38.5290], organ: "SDE" },
  { id: 141, name: "CRA Capacita", policy: "Trabalho", type: "Qualificação", address: "R. Dona Leopoldina, 935", neighborhood: "Centro", coords: [-3.7330, -38.5200], organ: "SDE" },
  { id: 142, name: "Instituto Juventude Inovação", policy: "Trabalho", type: "Qualificação", address: "R. Carlos Vasconcelos, 1677", neighborhood: "Meireles", coords: [-3.7364, -38.5117], organ: "SDE" },
  { id: 143, name: "Sebrae Ceará", policy: "Trabalho", type: "Qualificação", address: "Av. Monsenhor Tabosa, 777", neighborhood: "Centro", coords: [-3.7236, -38.5119], organ: "SDE" },
  { id: 144, name: "AJE Fortaleza", policy: "Trabalho", type: "Qualificação", address: "Av. Antônio Sales, 2371", neighborhood: "Dionisio Torres", coords: [-3.7446, -38.5025], organ: "SDE" }
];
