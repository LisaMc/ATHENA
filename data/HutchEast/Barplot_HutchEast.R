options(stringsAsFactors = F)

grantDesc <- read.delim("data/HutchEast/HutchEast_GrantDescriptionProjNum_7-8-15.txt", header=T, sep="\t")
grantMoney <- read.delim("data/HutchEast/HutchEast_GrantMoney_7-8-15.txt", header=T, sep="\t")
trials    <- read.delim("data/HutchEast/HutchEast_ClinicalTrials_7-8-15.txt", header=T, sep="\t")
members   <- read.delim("data/HutchEast/HutchEast_MembersCrossRef_7-8-15.txt", header=T, sep="\t")
pubs      <- read.delim("data/HutchEast/HutchEast_Publications_7-8-15.txt", header=T, sep="\t")

members[,"Tumor.Type.s."] <- gsub("\\s+","",members[,"Tumor.Type.s."])

AllTumorTypes = paste(members[,  "Tumor.Type.s."], collapse=";")
AllTumorTypes = unique(unlist(strsplit(AllTumorTypes, ";")))

NIH_yrs <-subset(grantMoney, Other.NIH..2010.2015. > 0)$Member..
NIH_yrs <- NIH_yrs[!is.na(NIH_yrs)]

subset(members, Index %in% NIH_yrs)