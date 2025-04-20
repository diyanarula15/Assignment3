
#!/bin/bash

# Print commands and exit on errors
set -e

echo "🚀 Starting setup for the portfolio project..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "✅ Homebrew already installed"
fi

# Install Node.js using nvm (Node Version Manager)
if ! command -v nvm &> /dev/null; then
    echo "📦 Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Source nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
    echo "✅ nvm already installed"
fi

# Install and use Node.js LTS version
echo "📦 Installing Node.js LTS version..."
nvm install --lts
nvm use --lts

# Install git if not installed
if ! command -v git &> /dev/null; then
    echo "📦 Installing git..."
    brew install git
else
    echo "✅ git already installed"
fi

# Clone the repository (uncomment and replace with your repository URL)
# echo "📦 Cloning the repository..."
# git clone <YOUR_REPOSITORY_URL>
# cd <YOUR_REPOSITORY_NAME>

# Create assets directory and move images
echo "📦 Setting up assets structure..."
mkdir -p public/assets
cp -r public/lovable-uploads/* public/assets/

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Start the development server
echo "🚀 Starting the development server..."
echo "You can view the project at http://localhost:8080"
npm run dev
