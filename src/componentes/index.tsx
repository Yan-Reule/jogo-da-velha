import { useEffect, useState } from "react";

export default function Home() {
    const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
    const [turnoX, setTurnoX] = useState<boolean>(true)
    const [jogoComecou, setJogoComecou] = useState<boolean>(false)
    const [vezDoJogador, setVezDoJogador] = useState<boolean>(true)

    const selecionouCampo = (item: number) => {
        if (tabuleiro[item]) return// Se o campo já estiver ocupado, não faz nada
        const novoTabuleiro = [...tabuleiro]// Cria uma cópia do tabuleiro
        novoTabuleiro[item] = 'X'// Define o símbolo X ou O dependendo do turno
        setTabuleiro(novoTabuleiro)// Atualiza o estado do tabuleiro
        setTurnoX(!turnoX)// Alterna o turno
    }


    const MicheleIA = () => {//inteligencia que joga contra o player
        const novoTabuleiro = [...tabuleiro];

        //1. verifica se pode ganhar o jogo com uma jogada. Se sim, ela faz essa jogada.
        const jogadapraganhar = encontrarJogadaParaGanhar(novoTabuleiro, 'O');
        if (jogadapraganhar !== null) {
            console.log('jogada para ganhar',jogadapraganhar)
            setVezDoJogador(true)
            setTimeout(() => {
                selecionaCampo(jogadapraganhar)
            }, 300)
            return
        }

        // 2. Bloquear o jogador
        const jogadaParaBloquear = encontrarJogadaParaGanhar(novoTabuleiro, 'X');
        if (jogadaParaBloquear !== null) {
            console.log('jogada para bloquear',jogadaParaBloquear)
            setVezDoJogador(true)
            setTimeout(() => {
                selecionaCampo(jogadaParaBloquear)
            }, 300)
            return
        }

        // 3. Escolher um campo estratégico (centro, cantos, etc.)
        const jogadaEstrategica = encontrarJogadaEstrategica(novoTabuleiro);
        if (jogadaEstrategica !== null) {
            console.log('jogada estrategica',jogadaEstrategica)
            setVezDoJogador(true)
            setTimeout(() => {
                selecionaCampo(jogadaEstrategica)
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
    }, [tabuleiro])

    const selecionaCampo = (campo: number) => {
        const novoTabuleiro = [...tabuleiro]

        novoTabuleiro[campo] = 'O'

        setTabuleiro(novoTabuleiro)
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <button onClick={() => {
                // selecionaCampo
            }}
                className="mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
                teste
            </button>
            <h1 className="text-3xl font-bold mb-4">Jogo da Velha</h1>
            <div className="grid grid-cols-3 gap-2 bg-orange-600 rounded-md p-4">
                {
                    tabuleiro.map((_, index) => (
                        <div onClick={() => {
                            console.log(_, index)
                            selecionouCampo(index)
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
                setJogoComecou(false)
                setTurnoX(true)
                setTabuleiro(Array(9).fill(null))
            }}
                className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
                Reiniciar
            </button>
        </div>
    )
}