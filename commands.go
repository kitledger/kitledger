package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "kitledger",
	Short: "Kitledger - Modern accounting and ERP system",
	Long:  `Kitledger is an open source project to build fast, modern alternatives to traditional ERP and accounting software.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Hi, this is Kitledger!")
	},
}

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the Kitledger server",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Starting Kitledger server...")
		startServer()
	},
}

func initCommands() {
	rootCmd.AddCommand(serveCmd)
}

func executeCommands() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
