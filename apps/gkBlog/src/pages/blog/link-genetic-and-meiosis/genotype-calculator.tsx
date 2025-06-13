import { useCallback, useMemo, useState } from "react";

import type React from "react";

export function PunnettSquareCalculator() {
  const [genotype, setGenotype] = useState("AaBb");
  const [, setError] = useState<string | null>(null);

  // 验证基因型输入
  const validateGenotype = (input: string): boolean => {
    // 检查是否为空
    if (!input.trim()) {
      setError("请输入基因型");
      return false;
    }

    // 检查格式是否正确（每对基因必须是两个字符，可以是AA, Aa, aa等）
    const regex = /^([A-Za-z][A-Za-z])+$/;
    if (!regex.test(input)) {
      setError("基因型格式不正确，每对基因必须是两个字符");
      return false;
    }

    // 检查每对基因是否使用相同的字母（大小写可以不同）
    for (let i = 0; i < input.length; i += 2) {
      if (input[i].toLowerCase() !== input[i + 1].toLowerCase()) {
        setError("每对基因必须使用相同的字母，如AA, Aa, aa");
        return false;
      }
    }

    // 检查基因对数是否超过7
    if (input.length / 2 > 7) {
      setError("最多支持7对基因");
      return false;
    }

    setError(null);
    return true;
  };

  // 解析基因型
  const parseGenotype = (input: string): string[][] => {
    const genes: string[][] = [];
    for (let i = 0; i < input.length; i += 2) {
      const allele1 = input[i];
      const allele2 = input[i + 1];
      genes.push([allele1, allele2]);
    }
    return genes;
  };

  // 生成所有可能的配子
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

  // 计算结果
  const result = useMemo(() => {
    if (!genotype || !validateGenotype(genotype)) {
      return null;
    }

    const genes = parseGenotype(genotype);
    const gametes = generateGametes(genes);

    // 创建旁氏表
    const punnettSquare: string[][] = gametes.map((gamete1) =>
      gametes.map((gamete2) => {
        const offspring = Array.from({ length: gamete1.length }, (_, i) => {
          const pair = [gamete1[i], gamete2[i]].sort().join("");
          return pair;
        }).join("");
        return offspring;
      })
    );

    return {
      gametes,
      punnettSquare,
    };
  }, [generateGametes, genotype]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateGenotype(genotype);
  };

  return (
    <div className="space-y-6">
      <p> 基因型（例如: AaBb）：</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input
            id="genotype"
            type="text"
            value={genotype}
            onChange={(e) => setGenotype(e.target.value)}
            placeholder="输入基因型，如 AaBb"
            className="w-full px-3 py-2 border dark:border-gray-700 rounded-md"
            aria-labelledby="genotype-label"
          />
          <p className="text-sm text-muted-foreground">
            使用大写字母表示显性等位基因，小写字母表示隐性等位基因，最多支持 7
            对基因
          </p>
        </div>
      </form>

      {result && (
        <>
          <p>可能的配子：</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {result.gametes.map((gamete) => (
              <div
                key={gamete}
                className="border dark:border-gray-700 rounded p-2 text-center"
              >
                {gamete}
              </div>
            ))}
          </div>

          <p>旁氏表（Punnett Square）：</p>

          <div className="overflow-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border dark:border-gray-700 p-2" scope="col">
                    <span className="sr-only">配子</span>
                  </th>
                  {result.gametes.map((gamete) => (
                    <th
                      key={gamete}
                      className="border dark:border-gray-700 p-2 bg-muted font-medium"
                    >
                      {gamete}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.punnettSquare.map((row, rowIndex) => (
                  <tr key={result.gametes[rowIndex]} className="border">
                    <th className="border dark:border-gray-700 p-2 bg-muted font-medium">
                      {result.gametes[rowIndex]}
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

export default PunnettSquareCalculator;
