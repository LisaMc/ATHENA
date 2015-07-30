options(stringsAsFactors = F)

grantDesc <- read.delim("data/HutchEast/HutchEast_GrantDescription_7-29-15.txt", header=T, sep="\t")
trials    <- read.delim("data/HutchEast/HutchEast_ClinicalTrials_7-24-15.txt", header=T, sep="\t")
members   <- read.delim("data/HutchEast/HutchEast_Members_7-24-15.txt", header=T, sep="\t")
pubs      <- read.delim("data/HutchEast/HutchEast_Publications_7-24-15.txt", header=T, sep="\t")



## add MemberID to grants table 
## Grants: LAST, FIRST MIDDLE

## match last name - if unique

grantMemberID <- apply(grantDesc, 1, function(grant){ 
   memID = grant["MemberID"]
   if(!grepl("\\d+",memID)){
      lastname = tolower(gsub(",.+","", grant["PI.Trim"]))
      memLast = subset(members, grepl(paste("^",lastname,"$", sep=""), tolower(Last.Name)))
      if(nrow(memLast) == 1)
         memID = memLast$Index
      else if (nrow(memLast) > 1){
         firstname = tolower(gsub(".+, ","", grant["PI.Trim"]))
         memFirstLast = subset(memLast, grepl(paste("^",firstname,"$", sep=""), tolower(First.Name)))
         if(nrow(memFirstLast) == 1)
            memID = memFirstLast$Index
         else
            cat(c(firstname, " ", lastname, "\n"))
      } else
            cat(c(lastname, "\n"))
   }
   memID
   })
   
grantDesc[,"MemberID"] <- grantMemberID



write.table(grantDesc,file="data/HutchEast/HutchEast_GrantDescription_7-29-15.txt", col.names=T,row.names=F, sep="\t", quote=F)

