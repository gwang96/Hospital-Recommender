# Polo-Care
An interactive app that visualizes a set of nodes representing nearby hospitals that offer treatment and prices for a certain disease falling within a Diagnosis-Related Group (DRG). Further steps to this project would be using patient readmission rates to compute a cost-benefit analysis.
The datasets used can be found at data.cms.gov.
## Usage
Query this server at /api?drg=###.
This should return a list of JSON Objects that have the fields
	- Provider Name
	- Provider Street Address
	- Provider City
	- Provider State
	- Provider Zip Code
	- Total Discharges
	- Average Total Payments
## Sample Usage
![polocare](https://cloud.githubusercontent.com/assets/8570913/19623171/8a552c40-988d-11e6-862b-eba624aa99a6.png)

# Google Slides Presentation
https://docs.google.com/presentation/d/10jE9n_--NdqLsR0jcwW07EpLQwoIACaqzsSLtL65hBk/edit?usp=sharing 
