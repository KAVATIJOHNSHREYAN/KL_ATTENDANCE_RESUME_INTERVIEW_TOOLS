import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              Built and developed by{" "}
              <a 
                href="https://github.com/KAVATIJOHNSHREYAN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-blue-500 transition-colors"
              >
                Kavati John Shreyan
              </a>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/KAVATIJOHNSHREYAN/LTPS_ATTENDANCE_CALCULATOR" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 
