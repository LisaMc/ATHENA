options(stringsAsFactors = F)

grantDesc <- read.delim("data/HutchEast/HutchEast_GrantDescription_7-29-15.txt", header=T, sep="\t")
trials    <- read.delim("data/HutchEast/HutchEast_ClinicalTrials_7-24-15.txt", header=T, sep="\t")
members   <- read.delim("data/HutchEast/HutchEast_Members_7-29-15.txt", header=T, sep="\t")
pubs      <- read.delim("data/HutchEast/HutchEast_Publications_7-29-15.txt", header=T, sep="\t")

grantDesc[!is.na(grantDesc$Subproject.Number), "Serial.Number"] <- grantDesc[!is.na(grantDesc$Subproject.Number), "Subproject.Number"]
if(colnames(grantDesc)[1] !="Serial.Number"){ 
  col = which(colnames(grantDesc)== "Serial.Number")
  grantDesc <- grantDesc[,c(col, 1:(col-1), (col+1):ncol(grantDesc))]
}

FullTable <- members
FullTable[,c("PubList", "GrantList", "TrialList")] = ""
pubsTable <- pubs
pubsTable[,c("InstList")] = ""

for(i in 1:nrow(pubs)){
  IDs <- gsub("\\s+", "", unlist(strsplit(pubs[i, "MemberID"], ";")))
  Insts = c()
  for(id in IDs){
     FullTable[FullTable$Index == id,"PubList"] = paste( FullTable[FullTable$Index == id,"PubList"] , pubs[i,"Index"], sep=";")
     Insts = c(Insts,FullTable[FullTable$Index == id,"Primary.Organization"] )
  }
  pubsTable[i, "InstList"] <- sub(";\\s+", ";", paste(unique(Insts), collapse=";"))
}
FullTable[, "PubList"] <- sub("^;", "", FullTable[, "PubList"])

for(i in 1:nrow(grantDesc)){
  IDs <- gsub("\\s+", "", unlist(strsplit(as.character(grantDesc[i, "MemberID"]), ";")))
  IDs <- IDs[!is.na(IDs)]
  for(id in IDs){
     FullTable[FullTable$Index == id,"GrantList"] = paste( FullTable[FullTable$Index == id,"GrantList"] , grantDesc[i,"Serial.Number"], sep=";")
  }
}
FullTable[, "GrantList"] <- sapply( FullTable[, "GrantList"], function(grants) { sub("^;", "", paste(unique(unlist(strsplit(grants, ";"))), collapse=";"))})

for(i in 1:nrow(trials)){
  IDs <- gsub("\\s+", "", unlist(strsplit(as.character(trials[i, "MemberID"]), ";")))
  IDs <- IDs[!is.na(IDs)]
  for(id in IDs){
     FullTable[FullTable$Index == id,"TrialList"] = paste( FullTable[FullTable$Index == id,"TrialList"] , trials[i,"Index"], sep=";")
  }
}
FullTable[, "TrialList"] <- sapply( FullTable[, "TrialList"], function(trial) { sub("^;", "", paste(unique(unlist(strsplit(trial, ";"))), collapse=";"))})

write.table(grantDesc,file="data/HutchEast/HutchEast_GrantDescriptionProjNum_7-29-15.txt", col.names=T,row.names=F, sep="\t", quote=F)
write.table(FullTable,file="data/HutchEast/HutchEast_MembersCrossRef_7-29-15.txt", col.names=T,row.names=F, sep="\t", quote=F)
write.table(pubsTable,file="data/HutchEast/HutchEast_PublicationsCrossRefInst_7-29-15.txt", col.names=T,row.names=F, sep="\t", quote=F)