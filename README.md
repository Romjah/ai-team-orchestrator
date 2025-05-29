# 🤖 AI Team Orchestrator

[![npm version](https://badge.fury.io/js/%40ai-team%2Forchestrator.svg)](https://badge.fury.io/js/%40ai-team%2Forchestrator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)

> **Zero-Config AI coding team for GitHub** - Install once, code forever with AI assistance

## ✨ Features

- **🚀 Zero Configuration** - Works immediately after installation
- **🤖 6 Specialized AI Agents** - Frontend, Backend, QA, Bug Hunter, Code Architect, Full-Stack
- **⚡ Automatic Detection** - Intelligently selects the right agent based on your issue
- **💰 100% Free** - Uses GitHub Actions (2000 minutes/month included)
- **📦 Professional Package** - NPM installable with CLI tools
- **🎯 Smart Triggers** - Keywords automatically select the appropriate specialist

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g @ai-team/orchestrator

# Or use directly with npx
npx @ai-team/orchestrator install
```

### Setup (30 seconds)

```bash
# Navigate to your Git repository
cd your-project

# Install AI Team
ai-team install

# Commit and push
git add . && git commit -m "🤖 Add AI Team" && git push

# Test with a demo issue
ai-team demo --type frontend
```

## 🤖 Available Agents

| Agent | Specialization | Triggered by Keywords |
|-------|---------------|----------------------|
| 🎨 **Frontend Specialist** | HTML, CSS, JS, React, Vue | `ui`, `css`, `html`, `component`, `frontend` |
| ⚙️ **Backend Specialist** | APIs, servers, databases | `api`, `server`, `database`, `backend` |
| 🐛 **Bug Hunter** | Bug fixing, debugging | `bug`, `fix`, `error`, `problème` |
| 🧪 **QA Engineer** | Testing, automation | `test`, `testing`, `spec`, `qa` |
| 🏗️ **Code Architect** | Refactoring, optimization | `refactor`, `optimize`, `clean` |
| 🚀 **Full-Stack Developer** | General development | Any other keywords |

## 📖 Usage

### CLI Commands

```bash
# Install AI Team in current repository
ai-team install [--type zero-config|full|github-app] [--force]

# Check installation status
ai-team status

# List available agents
ai-team agents

# Create demo issue to test
ai-team demo [--type frontend|backend|testing|bug|refactor]

# Initialize new project with AI Team
ai-team init <project-name>

# Remove AI Team
ai-team uninstall [--force]
```

### Programmatic Usage

```javascript
import { quickSetup, createDemoIssue } from '@ai-team/orchestrator';

// Install AI Team programmatically
const result = await quickSetup({ type: 'zero-config' });

// Create demo issue
await createDemoIssue('frontend');
```

## 🎯 How It Works

1. **Create GitHub Issue** with your coding request
2. **AI Analyzes** the issue content and keywords
3. **Agent Selection** happens automatically based on task type
4. **Code Generation** creates complete, working code
5. **Pull Request** is created automatically with the solution

### Example Workflow

```
Issue: "Create a modern landing page with CSS animations"
    ↓
Frontend Specialist selected 🎨
    ↓
Generates: index.html + styles.css + script.js
    ↓
Pull Request created automatically ✅
```

## 📋 Installation Types

### Zero-Config (Recommended)
- **Perfect for**: 99% of use cases
- **Setup time**: 30 seconds
- **Requirements**: None
- **Features**: All core functionality

```bash
ai-team install --type zero-config
```

### Full Configuration
- **Perfect for**: Advanced users wanting external APIs
- **Setup time**: 2 minutes
- **Requirements**: API tokens (Hugging Face, Groq)
- **Features**: Enhanced analysis, external AI models

```bash
ai-team install --type full
```

### GitHub App
- **Perfect for**: Teams wanting web interface
- **Setup time**: 5 minutes
- **Requirements**: Vercel account
- **Features**: Web UI, manual agent selection

```bash
ai-team install --type github-app
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/ai-team-orchestrator/ai-team-orchestrator.git
cd ai-team-orchestrator

# Install dependencies
npm install

# Run locally
npm run setup

# Run tests
npm test

# Build for production
npm run build
```

## 📂 Project Structure

```
@ai-team/orchestrator/
├── bin/                    # CLI executables
│   ├── ai-team.js         # Main CLI
│   └── install.js         # Installation script
├── lib/                   # Core modules
│   ├── installer.js       # Installation logic
│   └── demo.js           # Demo issue creation
├── templates/             # GitHub workflow templates
│   └── .github/          # Workflow and script templates
├── test/                  # Test files
├── demo/                  # Demo examples
├── package.json          # Package configuration
└── README.md             # This file
```

## 🎯 Examples

### Frontend Development
```
Issue: "Create a responsive navbar with mobile menu"
→ Frontend Specialist generates HTML + CSS + JS
```

### Backend Development
```
Issue: "Build REST API for user authentication"
→ Backend Specialist generates Express.js server with routes
```

### Bug Fixing
```
Issue: "Bug: form validation not working"
→ Bug Hunter analyzes and fixes the issue
```

### Testing
```
Issue: "Add unit tests for login function"
→ QA Engineer creates comprehensive test suite
```

## 🔧 Configuration

### Environment Variables (Optional)

```bash
# For full configuration type only
HUGGINGFACE_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

### GitHub Permissions

The package automatically sets up the required permissions:
- Contents: write
- Issues: write
- Pull requests: write

## 🚨 Troubleshooting

### Installation Issues

```bash
# Check if you're in a Git repository
git status

# Verify GitHub CLI is installed (for demo issues)
gh --version

# Check AI Team status
ai-team status
```

### AI Team Not Responding

1. **Check GitHub Actions** is enabled in your repository
2. **Verify files** are in correct locations (`.github/workflows/`)
3. **Check issue keywords** match agent specializations
4. **Wait 2-3 minutes** for workflow execution

### Common Solutions

```bash
# Reinstall with force flag
ai-team install --force

# Check installation status
ai-team status

# Create test issue
ai-team demo --type frontend
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub Repository**: [ai-team-orchestrator/ai-team-orchestrator](https://github.com/ai-team-orchestrator/ai-team-orchestrator)
- **NPM Package**: [@ai-team/orchestrator](https://npmjs.com/package/@ai-team/orchestrator)
- **Documentation**: [docs.ai-team-orchestrator.com](https://docs.ai-team-orchestrator.com)
- **Support**: [GitHub Issues](https://github.com/ai-team-orchestrator/ai-team-orchestrator/issues)

## 🙋 Support

- 📖 **Documentation**: Check our [complete guide](GUIDE-FINAL-ZERO-CONFIG.md)
- 🐛 **Bug Reports**: [Create an issue](https://github.com/ai-team-orchestrator/ai-team-orchestrator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ai-team-orchestrator/ai-team-orchestrator/discussions)
- 📧 **Email**: contact@ai-team-orchestrator.com

---

**🎉 Ready to revolutionize your development workflow?**

```bash
npm install -g @ai-team/orchestrator
ai-team install
```

*Your AI coding team is just one command away!* 🤖✨ 