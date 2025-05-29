// Code Executor simplifié pour GitHub App
class CodeExecutor {
    constructor() {
        this.filePatterns = [
            /```(\w+):([^\n]+)\n(.*?)```/gs,  // Pattern: ```lang:filename
            /```([^\n]+\.[\w]+)\n(.*?)```/gs  // Pattern: ```filename.ext
        ];
    }

    async processGeneratedCode(generatedCode, taskData, octokit, repository) {
        const files = this.parseCodeBlocks(generatedCode);
        const processedFiles = this.organizeFiles(files, taskData);
        
        return {
            files: processedFiles,
            modifiedFiles: processedFiles.map(f => f.path),
            summary: this.generateSummary(processedFiles, taskData)
        };
    }

    parseCodeBlocks(code) {
        const files = [];
        
        // Pattern 1: ```language:filename
        const pattern1 = /```(\w+):([^\n]+)\n(.*?)```/gs;
        let match;
        
        while ((match = pattern1.exec(code)) !== null) {
            const [, language, filename, content] = match;
            files.push({
                filename: filename.trim(),
                content: content.trim(),
                language: language
            });
        }
        
        // Pattern 2: ```filename.ext (sans language)
        if (files.length === 0) {
            const pattern2 = /```([^\n]+\.[\w]+)\n(.*?)```/gs;
            while ((match = pattern2.exec(code)) !== null) {
                const [, filename, content] = match;
                files.push({
                    filename: filename.trim(),
                    content: content.trim(),
                    language: this.detectLanguage(filename)
                });
            }
        }
        
        // Pattern 3: Blocs par langage (fallback)
        if (files.length === 0) {
            const languagePatterns = {
                javascript: /```(?:js|javascript)\n(.*?)```/gs,
                typescript: /```(?:ts|typescript)\n(.*?)```/gs,
                python: /```(?:py|python)\n(.*?)```/gs,
                css: /```css\n(.*?)```/gs,
                html: /```html\n(.*?)```/gs
            };
            
            for (const [lang, pattern] of Object.entries(languagePatterns)) {
                let index = 1;
                while ((match = pattern.exec(code)) !== null) {
                    files.push({
                        filename: `generated_${lang}_${index}.${this.getExtension(lang)}`,
                        content: match[1].trim(),
                        language: lang
                    });
                    index++;
                }
            }
        }
        
        return files;
    }

    organizeFiles(files, taskData) {
        return files.map(file => {
            const organizedPath = this.determineFilePath(file, taskData);
            return {
                path: organizedPath,
                content: file.content,
                language: file.language,
                originalName: file.filename
            };
        });
    }

    determineFilePath(file, taskData) {
        const filename = file.filename;
        const affectedAreas = taskData.affected_areas || ['general'];
        
        // Si le fichier a déjà un chemin complet
        if (filename.includes('/')) {
            return filename;
        }
        
        // Détermine le répertoire selon le type de fichier et la zone affectée
        const ext = this.getFileExtension(filename);
        
        if (['.js', '.jsx', '.ts', '.tsx', '.vue'].includes(ext)) {
            if (affectedAreas.includes('frontend')) {
                return `src/components/${filename}`;
            } else {
                return `src/${filename}`;
            }
        } else if (ext === '.py') {
            if (affectedAreas.includes('backend')) {
                return `src/api/${filename}`;
            } else {
                return `src/${filename}`;
            }
        } else if (['.css', '.scss', '.sass'].includes(ext)) {
            return `src/styles/${filename}`;
        } else if (filename.includes('test') || filename.includes('spec')) {
            return `tests/${filename}`;
        } else if (['.md', '.txt'].includes(ext)) {
            return `docs/${filename}`;
        } else {
            return `src/${filename}`;
        }
    }

    getFileExtension(filename) {
        const parts = filename.split('.');
        return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
    }

    detectLanguage(filename) {
        const ext = this.getFileExtension(filename).toLowerCase();
        const languageMap = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.py': 'python',
            '.css': 'css',
            '.scss': 'scss',
            '.html': 'html',
            '.vue': 'vue',
            '.php': 'php',
            '.rb': 'ruby',
            '.go': 'go',
            '.rs': 'rust',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c'
        };
        return languageMap[ext] || 'text';
    }

    getExtension(language) {
        const extensionMap = {
            javascript: 'js',
            typescript: 'ts',
            python: 'py',
            css: 'css',
            html: 'html',
            vue: 'vue',
            php: 'php',
            ruby: 'rb',
            go: 'go',
            rust: 'rs',
            java: 'java',
            cpp: 'cpp',
            c: 'c'
        };
        return extensionMap[language] || 'txt';
    }

    generateSummary(files, taskData) {
        const fileCount = files.length;
        const languages = [...new Set(files.map(f => f.language))];
        const areas = taskData.affected_areas?.join(', ') || 'général';
        
        let summary = `✅ ${fileCount} fichier(s) généré(s)\n`;
        summary += `🔧 Langages: ${languages.join(', ')}\n`;
        summary += `📁 Zones: ${areas}\n`;
        summary += `📋 Type: ${taskData.task_type || 'feature'}\n\n`;
        
        summary += `Fichiers créés:\n`;
        files.forEach(file => {
            summary += `- ${file.path} (${file.language})\n`;
        });
        
        return summary;
    }
}

module.exports = CodeExecutor; 