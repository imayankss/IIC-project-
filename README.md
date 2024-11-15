# IIC-project-

# autosight
AutoSight is a metagraph-powered system that enables users to earn income while they drive, by contributing to a dataset of road images that AI companies pay to access.

The system is comprised of four components:

1. **Mobile App**: Users can use the AutoSight Android app on their phone to capture and upload images of the road from their vehicle, earning tokens for each upload. 

2. **Image Server**: Images are uploaded and saved to an image server that hosts them publicly. 

3. **Metagraph**: A custom metagraph works as the blockchain backend for the AutoSight system and is responsible for validating, storing, and publishing image data.

4. **Web App**: Customers in demand for road images can view them on the AutoSight web app, which features a menu of image previews and interactive map. 


# Project Setup
Follow the instructions below to set up and configure each of the AutoSight components.

## Dependencies
Install the required dependencies:
- [Python3](https://www.python.org/downloads/)
- [Node JS](https://nodejs.org/en)
- [Euclid Development Environment dependencies](https://docs.constellationnetwork.io/sdk/guides/quick-start/#install-dependencies)
- [Android Studio](https://developer.android.com/studio) with an Android phone

## Metagraph
Follow the Euclid Development Environment [quickstart guide](https://docs.constellationnetwork.io/sdk/guides/quick-start) to clone and setup the development environment, including the steps to configure docker and a github access token.

In a new terminal window, navigate to the cloned `euclid-development-environment` directory: 

```bash
cd euclid-development-environment
```

Install the `autosight` project from this repository into the development environment:  

```bash
scripts/hydra install-template autosight --repo https://github.com/rhammell/autosight --path metagraph
```

Build the `autosight` project containers: 

```bash
scripts/hydra build
```

Start the metagraph components from a genesis snapshot: 

```bash
scripts/hydra start-genesis
```

When this process is complete, the terminal will display metagraph information, including the URLs for each metagraph node layer.

### Testing 
Test sending custom data to the deployed metagraph using the included `send_data_transaction.js` script. This script creates dummy image record data, cryptographically signs it, and sends the structured data to the metagraph's data L1 layer to be processed.

From the `euclid-development-environment` directory, navigate into the `testing_scripts` directory: 

```bash
cd source/project/autosight/testing_scripts
```

Install the required Node JS packages: 

```bash
npm i
```

In a code editor, open the `send_data_transaction.js` file, and update the following placeholder values, saving the file when complete: 
- `:your_global_l0_node_url`: A metagraph node's Global L0 URL, copied from the terminal output. (ex. `http://localhost:9000`)
- `:your_metagraph_l1_data_url`: A metagraph node's Data L1 URL, copied from the terminal output. (ex. `http://localhost:9400`) 
- `:your_wallet_address`: A valid DAG wallet address, obtainable from the Stargazer wallet. 

Run the test script: 

```bash
node send_data_transaction.js
```


## Web App
In a new terminal window, navigate into the cloned `autosight` directory, then into the `web_app/autosight-explorer` subdirectory: 

```bash
cd autosight
cd web_app/autosight-explorer
```

Install the required Node JS packages: 

```bash
npm i
```

In a code editor, open the `.env` file, and update the following placeholder value, saving the file when complete: 
- `REACT_APP_AUTOSIGHT_METAGRAPH_LO_IMAGES_URL`: The `/data-application/images` endpoint of a metagraph node's Metagraph L0 URL (ex. `http://localhost:9200/data-application/images`) 

Start the development server: 

```bash
npm start
```

The AutoSight web application is viewable by browsing to the default server address `http://localhost:3000`.

## Android App
Open Android Studio, select File → Open, select the `android_app/AutoSight` directory from the `autosight` cloned repository. 

In the upper left corner of the Project tool window, click the 'Project' dropdown menu, and select 'Android' from the options. 

Open the `AppConfig` file within the code editor by double clicking it in the file tree: app/kotlin+java/com.example.autosight/AppConfig

Update the following placeholder values in `AppConfig`, and save the file when complete: 
- `IMAGE_SERVER_ADDRESS`: Public URL of image server (ex. `http://<public-ip>:5050`)
- `METAGRAPH_L0_ADDRESS`: Public URL of metagraph L0 layer (ex. `http://<public-ip>:9200`)
- `METAGRAPH_DATA_L1_ADDRESS`: Public URL of metagraph Data L1 layer (ex. `http://<public-ip>:9400`)

Synch the project by selecting File → Sync Project with Gradle Files. Then, build the project by selecting Build → Make Project. 

Connect an Android device to the development computer via USB, then allow USB debugging on the phone when prompted. 

Select Run → Select Device, and select the connected device. 

Select Run → Run 'app' to install and run the AutoSight app on the connected Android phone. The app will remain installed on the device after it is disconnected.
