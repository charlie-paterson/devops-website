#!/bin/bash
# Stop on first error
set -e

# Colors
GREEN="\e[92m"
RED="\e[91m"
RESET="\e[0m"

echo -e "${GREEN}Starting local CI pipeline...${RESET}"

#Step 1: Check if index.html exists
if [ ! -f index.html ]; then
	echo -e "${RED}Error: index.html not found!${RESET}"
	exit 1
fi
echo -e "${GREEN}index.html found${RESET}"
echo
#Step 2: Basic HTML validation (check <html> tag)
if grep -q "<html" index.html; then
	echo -e "${GREEN}HTML tag passed${RESET}"
else
	echo -e "${RED}Error: Missing <html> tag!${RESET}"
	exit 1
fi
echo
#Step 3: Check <head> tag
if grep -q "<head>" index.html && grep -q "</head>" index.html; then
        echo -e "${GREEN}<head> tag passed${RESET}"
else
        echo -e "${RED}Error: Missing <head> tag!${RESET}"
        exit 1
fi
echo
#Step 4: Check <title> tag
if grep -q "<title>.*</title>" index.html; then
        echo -e "${GREEN}<title> tag passed${RESET}"
else
        echo -e "${RED}Error: Missing <title> tag!${RESET}"
        exit 1
fi
echo
#Step 5: Check <h1> tag
if grep -q "<h1>.*</h1>" index.html; then
        echo -e "${GREEN}<h1> tag passed${RESET}"
else
        echo -e "${RED}Error: Missing <h1> tag!${RESET}"
        exit 1
fi
echo
#Step 6: Check <p> tag
if grep -q "<p>.*</p>" index.html; then
        echo -e "${GREEN}<p> tag passed${RESET}"
else
        echo -e "${RED}Error: Missing <p> tag!${RESET}"
        exit 1
fi
echo
#Step 7: List project files (simulate build step)
echo -e "${GREEN}Project files:${RESET}"
	ls -la
echo
#Step 8: Build Docker image
echo -e "${GREEN}Project files:${RESET}"
docker build -t devops-website .

echo -e "${GREEN}Docker image built successfully${RESET}"
echo
#Step 9: Tag Docker image to Docker Hub
docker tag devops-website westbrom1968/devops-website:latest

#Step 10:Push Docker image to Docker Hub
echo -e "${GREEN}Pushing image to Docker Hub...${RESET}" 
docker push westbrom1968/devops-website:latest
echo
echo -e "${GREEN}Local CI pipeline completed successfully${RESET}"
