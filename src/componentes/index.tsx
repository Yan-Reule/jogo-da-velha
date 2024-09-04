import { useEffect, useState } from "react";

export default function Home() {
    const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
    const [turnoX, setTurnoX] = useState<boolean>(true)
    const [vezDoJogador, setVezDoJogador] = useState<boolean>(true)
    const [isJogadorX, setIsJogadorX] = useState<boolean>(true)

    const MicheleIA = () => {//inteligencia que joga contra o player
        const novoTabuleiro = [...tabuleiro];

        //1. verifica se pode ganhar o jogo com uma jogada. Se sim, ela faz essa jogada.
        const jogadapraganhar = encontrarJogadaParaGanhar(novoTabuleiro, (isJogadorX ? 'O' : 'X'));
        if (jogadapraganhar !== null) {
            console.log('jogada para ganhar', jogadapraganhar)
            setTimeout(() => {
                selecionaCampo(jogadapraganhar)
                setVezDoJogador(true)
            }, 300)
            return
        }

        // 2. Bloquear o jogador
        const jogadaParaBloquear = encontrarJogadaParaGanhar(novoTabuleiro, (!isJogadorX ? 'O' : 'X'));
        if (jogadaParaBloquear !== null) {
            console.log('jogada para bloquear', jogadaParaBloquear)
            setTimeout(() => {
                selecionaCampo(jogadaParaBloquear)
                setVezDoJogador(true)
            }, 300)
            return
        }

        // 3. Escolher um campo estratégico (centro, cantos, etc.)
        const jogadaEstrategica = encontrarJogadaEstrategica(novoTabuleiro);
        if (jogadaEstrategica !== null) {
            console.log('jogada estrategica', jogadaEstrategica)
            setTimeout(() => {
                selecionaCampo(jogadaEstrategica)
                setVezDoJogador(true)
            }, 300)
            return
        }
    }

    const encontrarJogadaEstrategica = (quadrados: Array<string | null>) => {
        const jogadasPreferidas = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // Preferência: Centro, Cantos, Laterais
        return jogadasPreferidas.find((index) => quadrados[index] === null) ?? null;
    };

    const encontrarJogadaParaGanhar = (quadrados: Array<string | null>, jogador: string) => {
        // Lista de todas as combinações que formam uma linha, coluna ou diagonal
        const linhas = [
            [0, 1, 2], // Primeira linha
            [3, 4, 5], // Segunda linha
            [6, 7, 8], // Terceira linha
            [0, 3, 6], // Primeira coluna
            [1, 4, 7], // Segunda coluna
            [2, 5, 8], // Terceira coluna
            [0, 4, 8], // Diagonal principal
            [2, 4, 6], // Diagonal secundária
        ];

        // Percorre cada linha para ver se há uma jogada que pode ganhar o jogo
        for (let i = 0; i < linhas.length; i++) {
            const [a, b, c] = linhas[i];

            // Verifica se dois dos três quadrados são do jogador e o terceiro está vazio
            if (quadrados[a] === jogador && quadrados[b] === jogador && quadrados[c] === null) return c;
            if (quadrados[a] === jogador && quadrados[c] === jogador && quadrados[b] === null) return b;
            if (quadrados[b] === jogador && quadrados[c] === jogador && quadrados[a] === null) return a;
        }

        // Se não houver nenhuma jogada vencedora, retorna null
        return null;
    };


    useEffect(() => {
        if (!vezDoJogador) {
            MicheleIA()
            console.log('alo')
        }
        setTimeout(() => {
            verificaGanhador()
        }, 200)
    }, [tabuleiro])

    useEffect(() => {
        if (isJogadorX) {
            setTurnoX(true)
        } else {
            setTurnoX(false)
            MicheleIA()
        }
    }, [isJogadorX])

    const selecionaCampo = (campo: number) => {
        const novoTabuleiro = [...tabuleiro]

        novoTabuleiro[campo] = (isJogadorX ? 'O' : 'X')

        setTabuleiro(novoTabuleiro)
        setVezDoJogador(true)
    }

    const selecionaCampoPlayer = (campo: number) => {
        const novoTabuleiro = [...tabuleiro]

        novoTabuleiro[campo] = (isJogadorX ? 'X' : 'O')

        setTabuleiro(novoTabuleiro)

        setVezDoJogador(false)
    }

    const verificaGanhador = () => {
        const linhas = [
            [0, 1, 2], // Primeira linha
            [3, 4, 5], // Segunda linha
            [6, 7, 8], // Terceira linha
            [0, 3, 6], // Primeira coluna
            [1, 4, 7], // Segunda coluna
            [2, 5, 8], // Terceira coluna
            [0, 4, 8], // Diagonal principal
            [2, 4, 6], // Diagonal secundária
        ]

        // Verifica se há algum vencedor
        for (let i = 0; i < linhas.length; i++) {
            const [a, b, c] = linhas[i]
            console.log(tabuleiro[a], tabuleiro[b], tabuleiro[c])
            if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
                console.log(a, b, c)
                // Se todos os campos da linha têm o mesmo valor, alguém venceu
                alert(`O jogador ${tabuleiro[a]} venceu!`)
                return
            }
        }
    }

    return (
        <main className="flex items-center justify-center">
            <div>
                <button onClick={() => {
                    console.log(isJogadorX)
                    setIsJogadorX(!isJogadorX)
                    // selecionaCampo
                }}
                    className={`mr-2 ${isJogadorX ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'}  text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-300 ease-in-out`}>
                    {
                        isJogadorX ?
                            <p>
                                jogar com O
                            </p>
                            :
                            <p>
                                jogar com X
                            </p>
                    }
                </button>
            </div>
            <div className="flex flex-col items-center justify-center h-screen">
                <p>O "X" começa</p>
                <h1 className="text-3xl font-bold mb-4">Jogo da Velha</h1>
                <div className="grid grid-cols-3 gap-2 bg-orange-600 rounded-md p-4">
                    {
                        tabuleiro.map((_, index) => (
                            <div onClick={() => {
                                console.log(_, index)
                                selecionaCampoPlayer(index)
                                setVezDoJogador(false)
                            }}
                                className="flex items-center justify-center border rounded-md w-20 h-20 bg-white item hover:cursor-pointer">
                                <p className={`text-5xl  ${_ === 'X' ? 'text-blue-600' : 'text-red-600'}`}>
                                    {_}
                                </p>
                            </div>
                        ))
                    }
                </div>
                <button onClick={() => {
                    // setJogoComecou(false)
                    setTurnoX(true)
                    setTabuleiro(Array(9).fill(null))

                    if (isJogadorX) {
                        setVezDoJogador(true)
                    } else {
                        setVezDoJogador(false)
                    }
                }}
                    className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
                    Reiniciar
                </button>
            </div>
        </main>
    )
}