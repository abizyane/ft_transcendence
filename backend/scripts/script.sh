python3 -m venv venv
source ./venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r ../app/requirements.txt

#Frontend intialise
npm install next --prefix ../../frontend/app
