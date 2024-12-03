#!/bin/bash

# Store the repository root directory
REPO_DIR="$(pwd)"
FRONTEND_DIR="$REPO_DIR/frontend"
BACKEND_STATIC_DIR="$REPO_DIR/backend/static"
GITHUB_DIR="$(dirname "$REPO_DIR")"  # This will point to the GitHub folder
LMS_REPO_DIR="$GITHUB_DIR/sunhill-lms"

# Print current step
echo "Starting frontend build process..."

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "Error: Frontend directory not found!"
    exit 1
fi

# Step 1: Build frontend
echo "Building frontend..."
cd "$FRONTEND_DIR" || exit 1
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Error: Frontend build failed!"
    exit 1
fi

# Step 2: Remove existing assets in backend static
echo "Removing old assets..."
if [ -d "$BACKEND_STATIC_DIR/assets" ]; then
    rm -rf "$BACKEND_STATIC_DIR/assets"
fi

# Step 3: Copy only assets folder to backend static
echo "Copying new assets..."
if [ -d "$FRONTEND_DIR/dist/assets" ]; then
    # Create static directory if it doesn't exist
    mkdir -p "$BACKEND_STATIC_DIR"
    # Copy only assets directory
    cp -r "$FRONTEND_DIR/dist/assets" "$BACKEND_STATIC_DIR/"
    echo "Frontend assets copied successfully!"
else
    echo "Error: assets directory not found after build!"
    exit 1
fi

# Step 4: Copy backend contents to sunhill-lms repository
echo "Copying backend contents to sunhill-lms repository..."

# Check if sunhill-lms directory exists
if [ ! -d "$LMS_REPO_DIR" ]; then
    echo "Creating sunhill-lms directory..."
    mkdir -p "$LMS_REPO_DIR"
fi

# Temporarily save .gitattributes if it exists
if [ -f "$LMS_REPO_DIR/.gitattributes" ]; then
    echo "Preserving .gitattributes..."
    cp "$LMS_REPO_DIR/.gitattributes" "/tmp/gitattributes_backup"
fi

# Remove existing contents in sunhill-lms except .git directory
echo "Removing existing contents in sunhill-lms..."
find "$LMS_REPO_DIR" -mindepth 1 -not -path "$LMS_REPO_DIR/.git*" -delete

# Restore .gitattributes if it was backed up
if [ -f "/tmp/gitattributes_backup" ]; then
    echo "Restoring .gitattributes..."
    mv "/tmp/gitattributes_backup" "$LMS_REPO_DIR/.gitattributes"
fi

# Copy all backend contents to sunhill-lms
echo "Copying new backend contents..."
cd "$REPO_DIR"
# Copy all files and directories from backend
cp -r backend/* "$LMS_REPO_DIR/"
# Copy hidden files (like .env) if they exist
cp -r backend/.* "$LMS_REPO_DIR/" 2>/dev/null || true

# Verify the copy
if [ "$(ls -A "$LMS_REPO_DIR")" ]; then
    echo "Files copied successfully!"
else
    echo "Error: Copy failed - destination directory is empty!"
    exit 1
fi

echo "Process completed successfully! Backend contents have been copied to sunhill-lms repository."