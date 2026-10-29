package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

/* Onde o Chrome costuma estar instalado no Windows. A ordem importa: a
   primeira que existir é a usada. */
func caminhoChrome() string {
	candidatos := []string{
		filepath.Join(os.Getenv("ProgramFiles"), "Google", "Chrome", "Application", "chrome.exe"),
		filepath.Join(os.Getenv("ProgramFiles(x86)"), "Google", "Chrome", "Application", "chrome.exe"),
		filepath.Join(os.Getenv("LocalAppData"), "Google", "Chrome", "Application", "chrome.exe"),
		filepath.Join(os.Getenv("ProgramFiles(x86)"), "Microsoft", "Edge", "Application", "msedge.exe"),
		filepath.Join(os.Getenv("ProgramFiles"), "Microsoft", "Edge", "Application", "msedge.exe"),
	}

	for _, c := range candidatos {
		if c == "" {
			continue
		}

		if info, err := os.Stat(c); err == nil && !info.IsDir() {
			return c
		}
	}

	return ""
}

/* Perfil separado só do totem. Sem ele o --kiosk é ignorado quando já
   existe um Chrome aberto com o perfil do usuário, e a tela volta com
   barra de endereço. Fica no LocalAppData de propósito: dentro do projeto
   o OneDrive tentaria sincronizar o perfil inteiro. */
func perfilTotem() string {
	base, err := os.UserCacheDir()
	if err != nil {
		base = os.TempDir()
	}

	perfil := filepath.Join(base, "TotemGardenVille", "chrome-profile")

	if err := os.MkdirAll(perfil, 0o755); err != nil {
		log.Printf("Não foi possível criar o perfil do totem: %v\n", err)
		return ""
	}

	return perfil
}

/* Modo quiosque: tela cheia de verdade, sem o "X" de sair da tela cheia que
   o Chrome mostra ao encostar o dedo, sem barra, sem gesto de voltar ao
   arrastar de lado e sem zoom por pinça — o toque só chega no jogo.
   O autoplay liberado é pelo vídeo da tela inicial. */
func argsQuiosque(url string) []string {
	args := []string{
		"--kiosk",
		"--start-fullscreen",
		"--disable-pinch",
		"--overscroll-history-navigation=0",
		"--disable-features=TranslateUI,TouchpadOverscrollHistoryNavigation,OverscrollHistoryNavigation",
		"--disable-translate",
		"--no-first-run",
		"--no-default-browser-check",
		"--disable-infobars",
		"--noerrdialogs",
		"--disable-session-crashed-bubble",
		"--disable-background-timer-throttling",
		"--autoplay-policy=no-user-gesture-required",
		"--check-for-update-interval=31536000",
	}

	if perfil := perfilTotem(); perfil != "" {
		args = append(args, "--user-data-dir="+perfil)
	}

	return append(args, url)
}

func main() {

	// Descobre a pasta atual
	currentDir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	// Descobre onde está o executável
	exePath, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}

	exeDir := filepath.Dir(exePath)

	var launcherDir string

	if strings.Contains(exeDir, "go-build") {
		launcherDir = currentDir
	} else {
		launcherDir = exeDir
	}

	// O launcher está dentro da pasta principal do projeto
	projectDir := filepath.Dir(launcherDir)

	// Pastas do projeto
	backendDir := filepath.Join(projectDir, "api")
	frontendDir := projectDir

	fmt.Println("Projeto:", projectDir)
	fmt.Println("Backend:", backendDir)
	fmt.Println("Frontend:", frontendDir)
	fmt.Println()

	// Verifica se as pastas existem
	if _, err := os.Stat(backendDir); err != nil {
		log.Fatalf("Pasta do backend não encontrada: %s", backendDir)
	}

	if _, err := os.Stat(frontendDir); err != nil {
		log.Fatalf("Pasta do frontend não encontrada: %s", frontendDir)
	}

	backend := exec.Command("node", "server.js")
	backend.Dir = backendDir

	backend.Stdout = os.Stdout
	backend.Stderr = os.Stderr

	frontend := exec.Command("npm", "run", "dev")
	frontend.Dir = frontendDir

	frontend.Stdout = os.Stdout
	frontend.Stderr = os.Stderr

	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()

		fmt.Println("Iniciando backend...")

		if err := backend.Start(); err != nil {
			log.Printf("Erro ao iniciar backend: %v\n", err)
			return
		}

		fmt.Println("Backend iniciado.")

		if err := backend.Wait(); err != nil {
			log.Printf("Backend encerrou: %v\n", err)
		}
	}()

	go func() {
		defer wg.Done()

		// Espera o backend começar
		time.Sleep(2 * time.Second)

		fmt.Println("Iniciando frontend...")

		if err := frontend.Start(); err != nil {
			log.Printf("Erro ao iniciar frontend: %v\n", err)
			return
		}

		fmt.Println("Frontend iniciado.")

		if err := frontend.Wait(); err != nil {
			log.Printf("Frontend encerrou: %v\n", err)
		}
	}()

	time.Sleep(4 * time.Second)

	url := "http://localhost:5173/"

	var open *exec.Cmd

	switch runtime.GOOS {

	case "windows":
		if chrome := caminhoChrome(); chrome != "" {
			fmt.Println("Abrindo em modo quiosque:", chrome)
			open = exec.Command(chrome, argsQuiosque(url)...)
		} else {
			// sem Chrome instalado: abre no navegador padrão, e aí a tela
			// cheia fica por conta do operador (F11)
			log.Println("Chrome não encontrado; abrindo no navegador padrão.")
			open = exec.Command("cmd", "/c", "start", "", url)
		}

	case "darwin":
		open = exec.Command("open", url)

	default:
		open = exec.Command("xdg-open", url)
	}

	/* Start, não Run: em quiosque o processo do Chrome fica vivo o tempo do
	   evento, e Run travaria o launcher aqui esperando ele fechar. */
	if err := open.Start(); err != nil {
		log.Printf("Erro ao abrir o navegador: %v\n", err)
	}

	// Mantém o launcher rodando enquanto
	// backend e frontend estiverem ativos
	wg.Wait()
}
