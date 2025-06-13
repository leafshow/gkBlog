import { useCallback, useMemo, useState } from "react";

function HybridCalculator() {
  const [parent1, setParent1] = useState("AaBbCCdd");
  const [parent2, setParent2] = useState("AabbCcDd");
  const [, setError] = useState<string | null>(null);

  // 验证基因型格式（复用原组件方法）
  const validateGenotype = (input: string): boolean => {
    if (!input.trim()) return false;

    const regex = /^([A-Za-z][A-Za-z])+$/;
    if (!regex.test(input)) return false;

    for (let i = 0; i < input.length; i += 2) {
      if (input[i].toLowerCase() !== input[i + 1].toLowerCase()) return false;
    }

    return true;
  };

  // 解析基因型为等位基因数组 [[A,a], [B,b], ...]
  const parseGenotype = (input: string): string[][] => {
    const genes: string[][] = [];
    for (let i = 0; i < input.length; i += 2) {
      const allele1 = input[i];
      const allele2 = input[i + 1];
      genes.push([allele1, allele2]);
    }
    return genes;
  };

  // 生成所有可能的配子（递归实现）
  const generateGametes = useCallback((genes: string[][]): string[] => {
    if (genes.length === 0) return [""];

    const firstGene = genes[0];
    const restGenes = genes.slice(1);
    const restGametes = generateGametes(restGenes);

    const gametes: string[] = [];

    firstGene.forEach((allele) => {
      restGametes.forEach((gamete) => {
        gametes.push(allele + gamete);
      });
    });

    return Array.from(new Set(gametes));
  }, []);

  // 计算杂交结果
  const result = useMemo(() => {
    if (!validateGenotype(parent1) || !validateGenotype(parent2)) {
      return null;
    }

    const genes1 = parseGenotype(parent1);
    const genes2 = parseGenotype(parent2);

    const gametes1 = generateGametes(genes1);
    const gametes2 = generateGametes(genes2);

    // 构建旁氏表
    const punnettSquare: string[][] = gametes1.map((g1) =>
      gametes2.map((g2) => {
        const offspring = Array.from({ length: g1.length }, (_, i) => {
          const pair = [g1[i], g2[i]].sort().join("");
          return pair;
        }).join("");
        return offspring;
      })
    );

    return {
      gametes1,
      gametes2,
      punnettSquare,
    };
  }, [parent1, parent2, generateGametes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGenotype(parent1) || !validateGenotype(parent2)) {
      setError("请输入有效的基因型");
    } else {
      setError(null);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p>亲本 1 基因型（例如: AaBbCCdd）：</p>
        <div className="space-y-2">
          <input
            id="parent1"
            type="text"
            value={parent1}
            onChange={(e) => setParent1(e.target.value)}
            placeholder="输入基因型，如 AaBbCCdd"
            className="w-full px-3 py-2 border dark:border-gray-700 rounded-md"
          />
        </div>

        <p>亲本 2 基因型（例如: AabbCcDd）：</p>
        <div className="space-y-2">
          <input
            id="parent2"
            type="text"
            value={parent2}
            onChange={(e) => setParent2(e.target.value)}
            placeholder="输入基因型，如 AabbCcDd"
            className="w-full px-3 py-2 border dark:border-gray-700 rounded-md"
          />
        </div>
      </form>

      {result && (
        <>
          <p>亲本 1 可能的配子：</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-4">
            {result.gametes1.map((gamete) => (
              <div
                key={`p1-${gamete}`}
                className="border dark:border-gray-700 rounded p-2 text-center"
              >
                {gamete}
              </div>
            ))}
          </div>

          <p>亲本 2 可能的配子：</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-4">
            {result.gametes2.map((gamete) => (
              <div
                key={`p2-${gamete}`}
                className="border dark:border-gray-700 rounded p-2 text-center"
              >
                {gamete}
              </div>
            ))}
          </div>

          <p>旁氏表（Punnett Square）：</p>
          <div className="overflow-auto">
            <table className="min-w-full  border-collapse">
              <thead>
                <tr>
                  <th className="border dark:border-gray-700 p-2" scope="col">
                    <span className="sr-only">配子</span>
                  </th>
                  {result.gametes2.map((gamete) => (
                    <th
                      key={`header-p2-${gamete}`}
                      className="border dark:border-gray-700 p-2 bg-muted font-medium"
                    >
                      {gamete}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.punnettSquare.map((row, rowIndex) => (
                  <tr
                    key={result.gametes1[rowIndex]}
                    className="dark:border-gray-700 border"
                  >
                    <th className="border dark:border-gray-700 p-2 bg-muted font-medium">
                      {result.gametes1[rowIndex]}
                    </th>
                    {row.map((cell) => (
                      <td
                        key={cell}
                        className="border dark:border-gray-700 p-2 text-center"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default HybridCalculator;
