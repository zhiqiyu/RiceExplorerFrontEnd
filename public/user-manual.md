# User Manual for RiceMapEngine

## Overall workflow

The RiceMapEngine is a web application that uses Google Earth Engine APIs to perform rice mapping with remote sensing. 

This application mainly includes three sub-applications, namely Phenology Explorer (PE), Empirical Thresholding (ET), and Supervised Classification (SC), that serve different purposes in the workflow of rice mapping. 

Specifically, PE provides functions to inspect ground truth samples by the phenology information acquired from remote sensing. By identifying phenology stages of ground truth samples based on remote sensing-generated phenology information, users can identify true rice samples and false rice samples, which should be removed for further analysis. 

The ET and SC are two methods for rice classification. ET allows rice mapping using empirical thresholds. Thresholds represent value ranges for the remote sensing images within certain phenological phases. The thresholds can be generated from PE or from previous experience. The classification result is generated simply by determine if a pixel value is within the provided value range. Ground truth samples are not required for this method.

SC is the good old supervised classification method that trains machine learning models with ground truth samples and classify remote sensing images to rice maps. Ground truth samples are required for this method. 

The following provides details about each sub-application.

## Phenology Explorer




## Empirical Thresholding


## Supervised Classification